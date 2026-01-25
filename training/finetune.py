#!/usr/bin/env python3
"""
OpenAI Fine-Tuning Script for Osita Extraction Model

Usage:
    1. Prepare your training data in training_data.jsonl
    2. Run: python finetune.py

Requirements:
    pip install openai python-dotenv
"""

import os
import json
import time
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

TRAINING_FILE = Path(__file__).parent / "training_data.jsonl"
MODEL_BASE = "gpt-4o-mini-2024-07-18"  # Or "gpt-3.5-turbo-0125" for cheaper option


def validate_training_data():
    """Validate the training data format."""
    if not TRAINING_FILE.exists():
        print(f"❌ Training file not found: {TRAINING_FILE}")
        print("\nCreate training_data.jsonl with your examples first.")
        return False
    
    with open(TRAINING_FILE, "r") as f:
        lines = f.readlines()
    
    if len(lines) < 10:
        print(f"⚠️  Warning: Only {len(lines)} examples. Recommend 50+ for best results.")
    
    errors = []
    for i, line in enumerate(lines, 1):
        try:
            data = json.loads(line)
            if "messages" not in data:
                errors.append(f"Line {i}: Missing 'messages' key")
            elif len(data["messages"]) < 3:
                errors.append(f"Line {i}: Need system, user, and assistant messages")
        except json.JSONDecodeError as e:
            errors.append(f"Line {i}: Invalid JSON - {e}")
    
    if errors:
        print("❌ Validation errors:")
        for err in errors[:10]:
            print(f"   {err}")
        return False
    
    print(f"✅ Validated {len(lines)} training examples")
    return True


def upload_training_file():
    """Upload the training file to OpenAI."""
    print("\n📤 Uploading training file...")
    
    with open(TRAINING_FILE, "rb") as f:
        response = client.files.create(file=f, purpose="fine-tune")
    
    print(f"✅ Uploaded: {response.id}")
    return response.id


def create_fine_tune_job(file_id: str):
    """Create a fine-tuning job."""
    print(f"\n🚀 Creating fine-tuning job with base model: {MODEL_BASE}")
    
    response = client.fine_tuning.jobs.create(
        training_file=file_id,
        model=MODEL_BASE,
        suffix="osita-extraction",  # Your model will be named ft:gpt-4o-mini:...:osita-extraction:...
        hyperparameters={
            "n_epochs": 3,  # Adjust based on dataset size
        }
    )
    
    print(f"✅ Job created: {response.id}")
    print(f"   Status: {response.status}")
    return response.id


def monitor_job(job_id: str):
    """Monitor the fine-tuning job until completion."""
    print(f"\n⏳ Monitoring job: {job_id}")
    print("   (This can take 10-60 minutes depending on dataset size)\n")
    
    while True:
        job = client.fine_tuning.jobs.retrieve(job_id)
        status = job.status
        
        if status == "succeeded":
            print(f"\n✅ Fine-tuning complete!")
            print(f"   Model ID: {job.fine_tuned_model}")
            print(f"\n📝 Update your .env file:")
            print(f"   OPENAI_FINETUNED_MODEL={job.fine_tuned_model}")
            return job.fine_tuned_model
        
        elif status == "failed":
            print(f"\n❌ Fine-tuning failed: {job.error}")
            return None
        
        elif status == "cancelled":
            print(f"\n⚠️ Job was cancelled")
            return None
        
        else:
            # Get latest events
            events = client.fine_tuning.jobs.list_events(job_id, limit=1)
            if events.data:
                latest = events.data[0]
                print(f"   [{status}] {latest.message}")
            else:
                print(f"   [{status}] Processing...")
            
            time.sleep(30)


def test_model(model_id: str):
    """Test the fine-tuned model with a sample."""
    print(f"\n🧪 Testing model: {model_id}")
    
    test_input = """## Page 1

**Electric Company ABC**
Invoice Date: 2024-02-15
Account: 123456

Billing Period: Feb 1 - Feb 28, 2024

Meter: M-100
Usage: 750 kWh

Total Due: $112.50"""

    response = client.chat.completions.create(
        model=model_id,
        messages=[
            {
                "role": "system",
                "content": "You are an expert at extracting structured data from electricity bills. Extract all relevant billing information and provide evidence for each field."
            },
            {
                "role": "user",
                "content": f"Extract data from this electricity bill:\n\n{test_input}"
            }
        ],
        temperature=0.1
    )
    
    print("\n📊 Test extraction result:")
    print(response.choices[0].message.content)


def main():
    print("=" * 60)
    print("  Osita Fine-Tuning Script")
    print("=" * 60)
    
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY not found in environment")
        return
    
    # Validate data
    if not validate_training_data():
        return
    
    # Confirm
    response = input("\n🔔 Ready to start fine-tuning? This will incur costs. (y/n): ")
    if response.lower() != 'y':
        print("Cancelled.")
        return
    
    # Upload
    file_id = upload_training_file()
    
    # Create job
    job_id = create_fine_tune_job(file_id)
    
    # Monitor
    model_id = monitor_job(job_id)
    
    if model_id:
        # Test
        test_model(model_id)
        
        print("\n" + "=" * 60)
        print("  ✅ Fine-tuning complete!")
        print("=" * 60)
        print(f"\n  Your fine-tuned model: {model_id}")
        print(f"\n  Next steps:")
        print(f"  1. Add to .env: OPENAI_FINETUNED_MODEL={model_id}")
        print(f"  2. Update extraction_service.py to use the new model")
        print("=" * 60)


if __name__ == "__main__":
    main()


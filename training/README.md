# Fine-Tuning Guide for Osita Extraction Model

## Overview

Fine-tuning improves the extraction accuracy by training on your specific energy bill formats.

## Step 1: Collect Training Examples

You need 50-100+ examples of energy bills with their correct extractions.

### Format: JSONL (one JSON object per line)

Each training example has this structure:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are an expert at extracting structured data from electricity bills. Extract all relevant billing information and provide evidence for each field."
    },
    {
      "role": "user", 
      "content": "Extract data from this electricity bill:\n\n## Page 1\n\n**ENERGY CORP**\nInvoice #12345\n\nBilling Period: January 1, 2024 - January 31, 2024\nAccount: ACC-789456\n\nMeter ID: MTR-001\nPrevious Reading: 10,000 kWh\nCurrent Reading: 10,500 kWh\nConsumption: 500 kWh\n\nTotal: 500 kWh\nAmount Due: €75.00"
    },
    {
      "role": "assistant",
      "content": "{\"supplier\": \"Energy Corp\", \"account_number\": \"ACC-789456\", \"billing_period\": {\"start_date\": \"2024-01-01\", \"end_date\": \"2024-01-31\", \"period_string\": \"January 1, 2024 - January 31, 2024\"}, \"meter_readings\": [{\"meter_id\": \"MTR-001\", \"reading_start\": 10000, \"reading_end\": 10500, \"consumption\": 500, \"unit\": \"kWh\"}], \"total_consumption\": {\"value\": 500, \"unit\": \"kWh\"}, \"total_amount\": {\"value\": 75.00, \"currency\": \"EUR\"}, \"evidence\": [{\"field\": \"supplier\", \"page\": 1, \"quote\": \"ENERGY CORP\", \"confidence\": 0.95}, {\"field\": \"total_consumption\", \"page\": 1, \"quote\": \"Total: 500 kWh\", \"confidence\": 0.95}]}"
    }
  ]
}
```

## Step 2: Create Training File

Save your examples to `training_data.jsonl`:

```bash
# Each line is one complete example
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
```

## Step 3: Upload & Fine-Tune

Run the fine-tuning script:

```bash
cd /Users/Uju/Desktop/OSITA2/training
python finetune.py
```

## Step 4: Update Osita Config

After fine-tuning completes, update your extraction service to use the new model.

## Tips for Good Training Data

1. **Variety**: Include different bill formats, languages, layouts
2. **Edge cases**: Include bills with missing fields, multiple meters, unusual units
3. **Accuracy**: Make sure your extraction labels are 100% correct
4. **Quantity**: Minimum 50 examples, 100+ is better
5. **Languages**: Include EN, FR, AR examples if you need multilingual support


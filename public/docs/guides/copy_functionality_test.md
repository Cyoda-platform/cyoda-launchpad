---
author: "Patrick Stanton"
category: "Test"
date: "2025-09-08"
excerpt: "Test guide to demonstrate the new copy functionality and scrollable containers for code blocks and copyable content."
featured: false
published: true
tags: ["test", "copy", "functionality"]
title: "Copy Functionality Test Guide"
---

# Copy Functionality Test Guide

This guide demonstrates the new copy functionality and scrollable containers implemented in the markdown rendering system.

## Code Blocks with Copy Functionality

### Short Code Block

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

### Long Code Block (Should be Scrollable)

```python
# This is a long Python script that demonstrates scrollable code blocks
import os
import sys
import json
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any

class DataProcessor:
    def __init__(self, config_path: str):
        self.config_path = config_path
        self.config = self.load_config()
        self.api_key = self.config.get('api_key')
        self.base_url = self.config.get('base_url', 'https://api.example.com')
        
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from JSON file."""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Config file not found: {self.config_path}")
            return {}
        except json.JSONDecodeError as e:
            print(f"Invalid JSON in config file: {e}")
            return {}
    
    def fetch_data(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Dict]:
        """Fetch data from API endpoint."""
        url = f"{self.base_url}/{endpoint}"
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"API request failed: {e}")
            return None
    
    def process_batch(self, items: List[Dict]) -> List[Dict]:
        """Process a batch of items."""
        processed_items = []
        
        for item in items:
            try:
                # Validate required fields
                if not all(key in item for key in ['id', 'name', 'timestamp']):
                    print(f"Skipping invalid item: {item}")
                    continue
                
                # Process timestamp
                timestamp = datetime.fromisoformat(item['timestamp'])
                item['processed_at'] = datetime.now().isoformat()
                item['age_hours'] = (datetime.now() - timestamp).total_seconds() / 3600
                
                # Add computed fields
                item['status'] = 'processed'
                item['hash'] = hash(f"{item['id']}{item['name']}")
                
                processed_items.append(item)
                
            except Exception as e:
                print(f"Error processing item {item.get('id', 'unknown')}: {e}")
                continue
        
        return processed_items

# Usage example
if __name__ == "__main__":
    processor = DataProcessor('config.json')
    
    # Fetch data from API
    data = processor.fetch_data('items', {'limit': 100, 'status': 'pending'})
    
    if data and 'items' in data:
        # Process the items
        processed = processor.process_batch(data['items'])
        
        # Save results
        output_file = f"processed_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(processed, f, indent=2)
        
        print(f"Processed {len(processed)} items. Results saved to {output_file}")
    else:
        print("No data to process")
```

## Command Examples (Should be Copyable)

### Shell Commands

```bash
# Install dependencies
npm install react-markdown remark-gfm

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Docker Commands

```bash
# Build Docker image
docker build -t my-app:latest .

# Run container
docker run -d -p 8080:8080 --name my-app-container my-app:latest

# View logs
docker logs my-app-container

# Stop and remove container
docker stop my-app-container
docker rm my-app-container
```

## Copyable Text Blocks (Blockquotes)

> Copy this entire prompt into Cyoda AI Assistant:
> 
> Generate a React + TypeScript front-end that consumes the local backend at `http://localhost:8080` using the attached OpenAPI (openAPI.json).
> Do not call Cyoda directly. Do not add browser authentication. All requests go through `/ui/**` endpoints.

> curl http://localhost:8080/ui/products

> This is a regular blockquote that should not be copyable because it doesn't match the patterns for commands or prompts.

## Configuration Examples

### Environment Variables

```env
# API Configuration
API_BASE_URL=https://api.example.com
API_KEY=your-api-key-here
API_TIMEOUT=30000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=password

# Application Settings
NODE_ENV=production
PORT=8080
LOG_LEVEL=info
```

### JSON Configuration

```json
{
  "name": "my-application",
  "version": "1.0.0",
  "description": "A sample application configuration",
  "settings": {
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    },
    "features": {
      "analytics": true,
      "debugging": false,
      "experimental": false
    }
  },
  "endpoints": {
    "api": "https://api.example.com/v1",
    "auth": "https://auth.example.com",
    "cdn": "https://cdn.example.com"
  },
  "limits": {
    "maxFileSize": "10MB",
    "maxRequests": 1000,
    "timeout": 30000
  }
}
```

## Testing the Features

1. **Copy Buttons**: Hover over code blocks to see the copy button appear
2. **Scrollable Content**: Long code blocks should have a maximum height with scrollbars
3. **Language Labels**: Code blocks with specified languages should show the language label
4. **Copyable Blockquotes**: Blockquotes with command patterns should have copy functionality
5. **Line Numbers**: Long code blocks should show line numbers when appropriate

## Expected Behavior

- ✅ Copy buttons appear on hover for all code blocks
- ✅ Copy buttons work and show success feedback
- ✅ Long code blocks are scrollable with max height
- ✅ Language labels are displayed for code blocks
- ✅ Command-like blockquotes have copy functionality
- ✅ Regular blockquotes remain unchanged
- ✅ Line numbers appear for long code blocks

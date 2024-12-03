# Medical Policy Analysis with React Flow

A React application that extracts and analyzes medical policy information from PDF documents using OpenAI's GPT-4 Vision API.

## Demo (on Render)
Render App: https://medical-policy-reactflow.onrender.com

## Features

- PDF document upload and processing
- Policy analysis using GPT-4
- Extraction of:
  - Medical necessity criteria
  - Necessary billing codes
  - Non-necessary billing codes
- Visual workflow representation using React Flow
- JSON export of analysis results

## Tech Stack

- React + React Flow
- OpenAI API (GPT-4 Vision)
- Tailwind CSS
- PDF parsing libraries

## Prerequisites

- Node.js >= 14
- OpenAI API key
- npm or yarn

## Setup

1. Clone repository:
```bash
git clone https://github.com/yourusername/medical-policy-reactflow.git
cd medical-policy-reactflow
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Run development server:
```bash
npm start
```

## Architecture

### Components

- `PDFProcessorNode`: Handles PDF upload and GPT analysis
- `DownloadNode`: Manages JSON data export
- `App.js`: Main workflow configuration

### Data Flow

1. User uploads PDF
2. PDF is converted to base64
3. GPT-4 Vision analyzes document
4. Results formatted as structured JSON
5. User downloads analysis results

## Configuration

### Webpack/CRACO

Project uses CRACO for webpack configuration management, particularly for Node.js polyfills:

```javascript
module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          // Node.js polyfills
        }
      }
    }
  }
};
```

## Usage

1. Upload medical policy PDF from _sample_policies_ directory
2. Wait for GPT analysis
3. Download structured JSON results
4. Process includes:
   - Text extraction
   - Policy analysis
   - Code identification
   - Necessity classification

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT

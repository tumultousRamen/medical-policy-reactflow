import React, { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import * as pdfjsLib from 'pdfjs-dist';
import OpenAI from 'openai';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PDFProcessorNode = ({ data }) => {
  const [file, setFile] = useState(null);
  const [extractedPolicies, setExtractedPolicies] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPDF = async (file) => {
    setIsProcessing(true);
    try {
      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      console.log('File loaded as ArrayBuffer');
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      console.log('PDF loading task created');
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      let fullText = '';
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      console.log('Full text extracted:', fullText.substring(0, 200) + '...'); // Show first 200 chars

      // Initialize OpenAI
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      console.log('Sending to OpenAI for analysis...');

      // Get GPT analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a medical policy analyst expert in extracting structured information from insurance policies. 
                      Your job is to analyze medical policy documents from insurance companies and extract structured data.`
          },
          {
            role: "user",
            content: `
              Please analyze the provided medical policy document and extract the following information in a structured format:

            1. MEDICALLY NECESSARY BILLING CODES
            - List all CPT/HCPCS codes that are explicitly stated as medically necessary or covered
            - Include the code description
            - Include any associated ICD-10 codes and their descriptions if specified
            - Note any relevant coverage criteria or limitations

            2. EXPERIMENTAL/INVESTIGATIONAL/NOT MEDICALLY NECESSARY CODES
            - List all CPT/HCPCS codes explicitly stated as experimental, investigational, or not medically necessary
            - Include the code description
            - Include any associated ICD-10 codes and their descriptions if specified
            - Note any specific exclusion criteria

            3. COVERAGE CRITERIA
            - List any specific medical necessity criteria that must be met for coverage
            - Include any documentation requirements
            - Note any frequency limitations or prior authorization requirements

            Please format the response in clear sections with bullet points for easy reading. If a code's status is ambiguous or conditional, note this explicitly.

              Format the output as JSON with the following structure:
              {
                "necessityCriteria": [],
                "necessaryBillingCodes": [],
                "notNecessaryBillingCodes": [],
              }

              Document text:
              ${fullText}
            `
          }
        ],
      });

      const extractedData = JSON.parse(completion.choices[0].message.content);
      console.log('Extracted and parsed data:', extractedData);
      setExtractedPolicies(extractedData);
      
      // Emit the extracted data to the next node
      if (data.onDataExtracted) {
        data.onDataExtracted(extractedData);
      }

    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      setFile(file);
      processPDF(file);
    }
  }, []);

  return (
    <div className="px-4 py-3 rounded-md shadow-lg bg-white min-w-[300px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">PDF Policy Upload</h3>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {isProcessing && (
        <div className="text-sm text-gray-600">
          Processing document...
        </div>
      )}

      {extractedPolicies && (
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Extracted Information:</h4>
          <div className="text-xs text-gray-600">
            <div>Diagnosis Codes: {extractedPolicies.necessaryBillingCodes.length}</div>
            <div>Procedure Codes: {extractedPolicies.notNecessaryBillingCodes.length}</div>
            <div>Necessity Criteria Rules: {extractedPolicies.necessityCriteria.length}</div>
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PDFProcessorNode;
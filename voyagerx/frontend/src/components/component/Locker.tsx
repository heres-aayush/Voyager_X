"use client";

import { useState } from "react";
import axios from "axios";

export default function Locker() {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const uploadToIPFS = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIpfsHash(response.data.cid);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-zinc-900 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="bg-zinc-800/50 p-8 rounded-xl shadow-2xl w-full max-w-[32rem] border border-zinc-700/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Secure File Storage
          <span className="block text-sm font-normal text-zinc-400 mt-1">Upload your files to IPFS</span>
        </h2>
        
        <div className="relative group">
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="mb-6 w-full text-sm text-white file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 
              file:bg-rose-500 file:text-white hover:file:bg-rose-600 file:transition-colors
              file:cursor-pointer cursor-pointer truncate" 
          />
          {!file && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-zinc-500">Choose a file to upload</p>
            </div>
          )}
        </div>

        <button
          onClick={uploadToIPFS}
          disabled={loading || !file}
          className="bg-rose-500 text-white px-6 py-3 rounded-lg disabled:bg-zinc-600 
            hover:bg-rose-600 transition-all duration-200 w-full font-medium
            disabled:cursor-not-allowed shadow-lg hover:shadow-rose-500/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Uploading...
            </span>
          ) : "Upload to IPFS"}
        </button>

        {ipfsHash && (
          <div className="mt-6 p-4 bg-zinc-700/50 rounded-lg border border-zinc-600/50 backdrop-blur-sm">
            <p className="text-sm text-zinc-300 mb-2">Successfully uploaded to IPFS!</p>
            <div className="flex items-center justify-between">
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2 group truncate"
              >
                <span className="truncate">{ipfsHash}</span>
                <svg className="w-4 h-4 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
      setIpfsHash(null); // reset previous hash
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
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-zinc-950 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-2">Secure File Locker</h1>
        <p className="text-zinc-400 text-center mb-8 text-sm">Upload your files safely to IPFS</p>

        <div className="mb-6">
          <label
            htmlFor="file"
            className={`flex items-center justify-center w-full px-6 py-4 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer ${
              file ? "border-green-500 bg-green-900/20" : "border-zinc-700 hover:border-rose-500"
            }`}
          >
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <span className="truncate text-green-400">{file.name}</span>
            ) : (
              <span className="text-zinc-400">Click to choose a file</span>
            )}
          </label>
        </div>

        <button
          onClick={uploadToIPFS}
          disabled={loading || !file}
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload to IPFS"
          )}
        </button>

        {ipfsHash && (
          <div className="mt-6 p-4 bg-zinc-800 border border-zinc-700 rounded-lg animate-fade-in">
            <p className="text-sm text-green-400 mb-2">Upload successful! View your file:</p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 text-sm break-all transition-colors underline flex items-center gap-1"
            >
              {ipfsHash}
              <svg className="w-4 h-4 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

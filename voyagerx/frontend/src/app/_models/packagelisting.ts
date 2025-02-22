import mongoose, { Schema, Document } from "mongoose";

interface IPackage extends Document {
    packageId: number;
    packageTitle: string;
    destination: string;
    duration: string;
    highlights: string;
    inclusions: string;
    basePrice: number;
    availability: string;
    images: string[];
}

const PackageSchema: Schema = new mongoose.Schema({
    packageId: { type: Number, required: true, unique: true },
    packageTitle: { type: String, required: false, trim: false },
    destination: { type: String, required: false, trim: false },
    duration: { type: String, required: false, trim: false },
    highlights: { type: String, required: false, trim: false },
    inclusions: { type: String, required: false, trim: false },
    basePrice: { type: Number, required: true },
    availability: { type: String, required: true, trim: false },
    images: { type: [String], required: true },
});

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);

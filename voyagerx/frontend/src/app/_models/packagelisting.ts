import mongoose from 'mongoose';

interface IPackage {
  packageTitle: string;
  destination: string;
  duration: string;
  highlights: string;
  inclusions: string;
  basePrice: number;
  availability: string;
  images: string[];
}

const packageSchema = new mongoose.Schema<IPackage>({
  packageTitle: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  highlights: { type: String, required: true },
  inclusions: { type: String, required: true },
  basePrice: { type: Number, required: true },
  availability: { type: String, required: true },
  images: [{ type: String }]
}, {
  timestamps: true
});

const PackageModel = mongoose.models.Package || mongoose.model<IPackage>('Package', packageSchema);

export default PackageModel;

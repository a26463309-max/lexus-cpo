import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Car,
  Upload,
  Camera,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  Star,
  X,
  Trash2,
} from "lucide-react";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/hero-appraisal-lexus-4fX7FzMWR76mDaDMUYWWe8.webp";

const CONSENT_TEXT = `歡迎您瀏覽使用本網站，依和泰汽車（以下稱「本公司」）隱私權保護政策與相關法令之規定，請您於填寫個人資料前，務必詳讀下列條款內容。

本公司為了解使用者需求與喜好，以便提供更好的服務，需請您提供以下個人資料：包含但不限於本人姓名、身分證號碼、生日、電話(住宅)(公司)、行動電話、e-mail、戶籍地址及聯絡地址、相對人現存本人之所有資料、交易及維修資訊、行動及網路媒體資訊等。

本公司將持續蒲集、處理及利用您的個人資料，包含行銷、維修、保固、提供客戶服務、消費者保護、契約、類似契約或其他法律關係事務、執行其他經營合於營業登記項目或組織章程所定之業務、調查、統計與研究分析、個人資料之合法交易業務。截至您主動請求本公司刪除、停止處理或利用您的個人資料為止。您有權向本集團支付必要成本費用以查詢、請求閱覽或製給複製本，或請求補充、更正、停止蒲集、處理、利用及刪除您所提供的個人資料。

本公司將利使用您所提供的個人資料與您確認身份、進行連絡、提供本公司及關係企業或合作夥伴之相關服務與資訊，包含和泰汽車股份有限公司及其關係企業、台灣地區授權經銷商及有合作關係第三人。本人知悉並同意對象範圍及於未來於和泰汽車及附註所述公司官方網站所增加之公司。（形式包含但不限於商品行銷活動、DM或電子報寄送、廣告資料等宣傳目的範圍內使用）。

您可自由選擇是否提供本公司您的個人資料，若您不願提供個人資料，仍可造訪本網站部分內容，但可能無法使用網站中特定服務等功能，敬請諒察。

若您所提供之個人資料，經檢舉或本公司發現不足以確認您的身分真實性或有冒用、盜用、資料不實等情形，本公司有權暫時停止提供對您的服務。

您瞭解此一同意符合個人資料保護法及相關法規之要求，具有書面同意本公司基於上述目的蒲集、處理及利用您的個人資料之效果。

註：國都汽車、北都汽車、桃苗汽車、中部汽車、南都汽車、高都汽車、蘭揚汽車、東部汽車、和航汽車、中誠汽車、和榮汽車、長源汽車、和泰豐田物料運搬、和泰聯網、和泰移動服務、和泰產險、和潤企業、和運租車、和雲行動服務、車美仕、興聯科技、和泰興業、國瑞汽車、和展投資、和昭實業、和安保代、和全保代、和勁行銷、和泰服務行銷等關係企業及本公司共同行銷、交互運用客戶資料、合作推廣業務之公司。`;

const MAX_VEHICLE_PHOTOS = 10;
const MAX_FILE_SIZE_MB = 10;

interface UploadFile {
  file: File;
  preview: string;
  imageType: "license" | "vehicle";
}

interface FormData {
  name: string;
  phone: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  relation: string;
  notes: string;
  consent: boolean;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Appraisal() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    relation: "",
    notes: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [licenseFile, setLicenseFile] = useState<UploadFile | null>(null);
  const [vehicleFiles, setVehicleFiles] = useState<UploadFile[]>([]);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);

  const submitMutation = trpc.appraisal.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("估價申請已送出，我們將盡快與您聯繫");
    },
    onError: (err) => {
      toast.error("送出失敗：" + err.message);
    },
  });

  const isSubmitting = submitMutation.isPending;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(`不支援的檔案格式：${file.name}，請上傳 JPG、PNG 或 WebP 格式`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`檔案過大：${file.name}，請上傳 ${MAX_FILE_SIZE_MB}MB 以下的檔案`);
      return false;
    }
    return true;
  };

  const handleLicenseSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;

    // Revoke old preview URL
    if (licenseFile) URL.revokeObjectURL(licenseFile.preview);

    setLicenseFile({
      file,
      preview: URL.createObjectURL(file),
      imageType: "license",
    });
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_VEHICLE_PHOTOS - vehicleFiles.length;
    if (remaining <= 0) {
      toast.error(`最多只能上傳 ${MAX_VEHICLE_PHOTOS} 張車輛照片`);
      return;
    }

    const newFiles: UploadFile[] = [];
    const fileArray = Array.from(files).slice(0, remaining);

    for (const file of fileArray) {
      if (!validateFile(file)) continue;
      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        imageType: "vehicle",
      });
    }

    if (Array.from(files).length > remaining) {
      toast.warning(`已達上限，僅選取前 ${remaining} 張照片`);
    }

    setVehicleFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeLicense = () => {
    if (licenseFile) {
      URL.revokeObjectURL(licenseFile.preview);
      setLicenseFile(null);
    }
  };

  const removeVehicleFile = (index: number) => {
    setVehicleFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.brand || !formData.model || !formData.year || !formData.mileage || !formData.relation) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    if (!formData.consent) {
      toast.error("請同意個人資料同意書");
      return;
    }

    // Convert files to base64
    const images: { base64: string; mimeType: string; fileName: string; imageType: "license" | "vehicle" }[] = [];

    if (licenseFile) {
      const base64 = await fileToBase64(licenseFile.file);
      images.push({
        base64,
        mimeType: licenseFile.file.type,
        fileName: licenseFile.file.name,
        imageType: "license",
      });
    }

    for (const vf of vehicleFiles) {
      const base64 = await fileToBase64(vf.file);
      images.push({
        base64,
        mimeType: vf.file.type,
        fileName: vf.file.name,
        imageType: "vehicle",
      });
    }

    submitMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      mileage: formData.mileage,
      relation: formData.relation,
      notes: formData.notes || undefined,
      images: images.length > 0 ? images : undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa]">
        <Header />
        <div className="pt-16" />
        <HeroBanner
          title="鑑 價 服 務"
          backgroundImage={HERO_IMAGE}
          breadcrumbs={[
            { label: "首頁", href: "/" },
            { label: "鑑價服務" },
          ]}
        />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4 tracking-wide">
              估價申請已送出
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              感謝您的信任，我們的專業鑑價師將在
              <span className="font-semibold text-gray-700"> 1-2 個工作天</span>
              內與您聯繫，為您提供精準的車輛估價服務。
            </p>
            <a
              href="/"
              className="inline-block bg-[#0a0a0a] text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-[#1a1a1a] transition-colors"
            >
              返回首頁
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      <div className="pt-16" />

      <HeroBanner
        title="鑑 價 服 務"
        backgroundImage={HERO_IMAGE}
        breadcrumbs={[
          { label: "首頁", href: "/" },
          { label: "鑑價服務" },
        ]}
      />

      {/* Service Highlights */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0a0a0a] rounded flex items-center justify-center shrink-0">
                <Shield size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-1">
                  專業鑑價團隊
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  由 LEXUS 原廠認證鑑價師親自為您的愛車進行全方位評估
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0a0a0a] rounded flex items-center justify-center shrink-0">
                <Star size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-1">
                  公正透明估價
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  依據市場行情與車況提供最合理的估價，絕無隱藏費用
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0a0a0a] rounded flex items-center justify-center shrink-0">
                <Clock size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-1">
                  快速回覆服務
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  提交申請後 1-2 個工作天內，專人主動與您聯繫
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <main className="flex-1">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Form Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-[#0a0a0a] rounded flex items-center justify-center">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-gray-900 tracking-wide">
                車輛估價表單
              </h2>
              <p className="text-base text-gray-500">
                請填寫以下資訊，我們將盡快為您估價
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-6 pb-3 border-b border-gray-100">
                聯絡資訊
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="請輸入姓名"
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    聯絡電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="例：0912-345-678"
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-6 pb-3 border-b border-gray-100">
                車輛資訊
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    品牌 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="例：LEXUS"
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    車型 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="例：RX 350h"
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    年份 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="例：2022"
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    里程數（公里） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="例：50000"
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-6 pb-3 border-b border-gray-100">
                上傳資料（選填）
              </h3>
              <div className="space-y-6">
                {/* Upload License */}
                <div>
                  <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                    <FileText size={18} />
                    上傳行照
                  </label>
                  <input
                    ref={licenseInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLicenseSelect}
                    className="hidden"
                  />
                  {licenseFile ? (
                    <div className="relative inline-block">
                      <img
                        src={licenseFile.preview}
                        alt="行照預覽"
                        className="w-full max-w-[300px] h-auto rounded border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeLicense}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                      >
                        <Trash2 size={14} />
                      </button>
                      <p className="text-xs text-gray-500 mt-2">{licenseFile.file.name}</p>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors p-8 text-center cursor-pointer group"
                      onClick={() => licenseInputRef.current?.click()}
                    >
                      <Upload
                        size={28}
                        className="mx-auto mb-2 text-gray-300 group-hover:text-gray-500 transition-colors"
                      />
                      <p className="text-sm text-gray-400 group-hover:text-gray-600">
                        點擊上傳行照照片
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        支援 JPG、PNG、WebP 格式，{MAX_FILE_SIZE_MB}MB 以下
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Vehicle Photos */}
                <div>
                  <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                    <Camera size={18} />
                    上傳車輛照片（最多{MAX_VEHICLE_PHOTOS}張）
                    <span className="text-gray-400 font-normal">
                      {vehicleFiles.length}/{MAX_VEHICLE_PHOTOS}
                    </span>
                  </label>
                  <input
                    ref={vehicleInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleVehicleSelect}
                    className="hidden"
                  />

                  {/* Preview Grid */}
                  {vehicleFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                      {vehicleFiles.map((vf, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={vf.preview}
                            alt={`車輛照片 ${index + 1}`}
                            className="w-full h-24 sm:h-28 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeVehicleFile(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X size={12} />
                          </button>
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{vf.file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {vehicleFiles.length < MAX_VEHICLE_PHOTOS && (
                    <div
                      className="border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors p-6 text-center cursor-pointer group"
                      onClick={() => vehicleInputRef.current?.click()}
                    >
                      <Camera
                        size={28}
                        className="mx-auto mb-2 text-gray-300 group-hover:text-gray-500 transition-colors"
                      />
                      <p className="text-sm text-gray-400 group-hover:text-gray-600">
                        點擊上傳車輛照片
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        支援 JPG、PNG、WebP 格式，{MAX_FILE_SIZE_MB}MB 以下
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide mb-6 pb-3 border-b border-gray-100">
                其他資訊
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    車主與出售人關係 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors"
                  >
                    <option value="">請選擇</option>
                    <option value="本人">本人</option>
                    <option value="配偶">配偶</option>
                    <option value="家人">家人</option>
                    <option value="朋友代售">朋友代售</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    備註說明（選填）
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="例：車況良好、原廠保養、無事故..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <label className="flex items-center gap-2 text-base text-gray-600">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="accent-gray-800"
                />
                我已詳閱
                <button
                  type="button"
                  onClick={() => setShowConsent(true)}
                  className="text-blue-600 hover:underline"
                >
                  個人資料同意書
                </button>
              </label>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-16 py-4 bg-[#0a0a0a] text-white text-base font-medium tracking-widest hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "上傳中，請稍候..." : "送出估價申請"}
              </button>
              <p className="text-sm text-gray-400 mt-4">
                提交後，我們的專員會在 1-2 個工作天內與您聯繫
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {/* 個人資料同意書 Dialog */}
      {showConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConsent(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-[700px] w-full max-h-[80vh] flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-display text-lg font-semibold text-gray-900 tracking-wide">
                個人資料蒲集、處理及利用同意書
              </h3>
              <button
                onClick={() => setShowConsent(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {CONSENT_TEXT.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-base">{paragraph}</p>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowConsent(false)}
                className="bg-gray-900 text-white px-8 py-3 rounded text-base font-medium hover:bg-gray-800 transition-colors tracking-wide"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

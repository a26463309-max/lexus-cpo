/*
 * Design: Urban Night Gradient - Lexus CPO
 * Contact form page with service hotline
 */
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { taiwanCities, cityDistricts } from "@/lib/vehicleData";
import { Loader2, CheckCircle, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/hero-contact-STRa6EHnpWE8DaxYooyvM7.webp";

const CONSENT_TEXT = `歡迎您瀏覽使用本網站，依和泰汽車（以下稱「本公司」）隱私權保護政策與相關法令之規定，請您於填寫個人資料前，務必詳讀下列條款內容。

本公司為了解使用者需求與喜好，以便提供更好的服務，需請您提供以下個人資料：包含但不限於本人姓名、身分證號碼、生日、電話(住宅)(公司)、行動電話、e-mail、戶籍地址及聯絡地址、相對人現存本人之所有資料、交易及維修資訊、行動及網路媒體資訊等。

本公司將持續蒲集、處理及利用您的個人資料，包含行銷、維修、保固、提供客戶服務、消費者保護、契約、類似契約或其他法律關係事務、執行其他經營合於營業登記項目或組織章程所定之業務、調查、統計與研究分析、個人資料之合法交易業務。截至您主動請求本公司刪除、停止處理或利用您的個人資料為止。您有權向本集團支付必要成本費用以查詢、請求閱覽或製給複製本，或請求補充、更正、停止蒲集、處理、利用及刪除您所提供的個人資料。

本公司將利使用您所提供的個人資料與您確認身份、進行連絡、提供本公司及關係企業或合作夥伴之相關服務與資訊，包含和泰汽車股份有限公司及其關係企業、台灣地區授權經銷商及有合作關係第三人。本人知悉並同意對象範圍及於未來於和泰汽車及附註所述公司官方網站所增加之公司。（形式包含但不限於商品行銷活動、DM或電子報寄送、廣告資料等宣傳目的範圍內使用）。

您可自由選擇是否提供本公司您的個人資料，若您不願提供個人資料，仍可造訪本網站部分內容，但可能無法使用網站中特定服務等功能，敬請諒察。

若您所提供之個人資料，經檢舉或本公司發現不足以確認您的身分真實性或有冒用、盜用、資料不實等情形，本公司有權暫時停止提供對您的服務。

您瞭解此一同意符合個人資料保護法及相關法規之要求，具有書面同意本公司基於上述目的蒲集、處理及利用您的個人資料之效果。

註：國都汽車、北都汽車、桃苗汽車、中部汽車、南都汽車、高都汽車、蘭揚汽車、東部汽車、和航汽車、中誠汽車、和榮汽車、長源汽車、和泰豐田物料運搬、和泰聯網、和泰移動服務、和泰產險、和潤企業、和運租車、和雲行動服務、車美仕、興聯科技、和泰興業、國瑞汽車、和展投資、和昭實業、和安保代、和全保代、和勁行銷、和泰服務行銷等關係企業及本公司共同行銷、交互運用客戶資料、合作推廣業務之公司。`;

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "M",
    email: "",
    city: "",
    district: "",
    phone: "",
    licensePlate: "",
    contactTime: [] as string[],
    content: "",
    consent: false,
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("表單已成功送出！");
    },
    onError: (err) => {
      toast.error("送出失敗：" + err.message);
    },
  });

  const districts = formData.city ? (cityDistricts[formData.city] || []) : [];

  const handleTimeToggle = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      contactTime: prev.contactTime.includes(time)
        ? prev.contactTime.filter((t) => t !== time)
        : [...prev.contactTime, time],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.city) {
      toast.error("請填寫所有必填欄位");
      return;
    }
    if (!formData.consent) {
      toast.error("請同意個人資料同意書");
      return;
    }
    submitMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      licensePlate: formData.licensePlate || undefined,
      city: formData.city || undefined,
      district: formData.district || undefined,
      contactTime: formData.contactTime.join(",") || undefined,
      message: formData.content || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-16">
          <HeroBanner
            title="聯 絡 我 們"
            backgroundImage={HERO_IMAGE}
            breadcrumbs={[
              { label: "首頁", href: "/" },
              { label: "聯絡我們" },
            ]}
          />
          <div className="max-w-[600px] mx-auto px-4 py-20 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h2 className="font-display text-2xl font-semibold text-gray-900 mb-3">
              感謝您的來信
            </h2>
            <p className="text-gray-500 mb-8">我們將盡快與您聯繫，請耐心等候。</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "", gender: "M", email: "", city: "", district: "",
                  phone: "", licensePlate: "", contactTime: [], content: "", consent: false,
                });
              }}
              className="bg-gray-900 text-white px-8 py-3 rounded text-base font-medium hover:bg-gray-800 transition-colors"
            >
              再次填寫
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        <HeroBanner
          title="聯 絡 我 們"
          backgroundImage={HERO_IMAGE}
          breadcrumbs={[
            { label: "首頁", href: "/" },
            { label: "聯絡我們" },
          ]}
        />

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">


          {/* Form */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-1">
              請填寫相關資料，將有專人與您聯繫
            </p>
            <p className="text-sm text-gray-500">*為必填欄位</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-base font-medium text-gray-700">*姓名</label>
                <div className="flex items-center gap-3 mt-1.5">
                  <input
                    type="text"
                    placeholder="請輸入您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1 px-3 py-2.5 border-b border-gray-300 text-base focus:outline-none focus:border-gray-800 transition-colors bg-transparent"
                  />
                  <label className="flex items-center gap-1 text-base text-gray-600 whitespace-nowrap">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === "M"}
                      onChange={() => setFormData({ ...formData, gender: "M" })}
                      className="accent-gray-800"
                    />
                    先生
                  </label>
                  <label className="flex items-center gap-1 text-base text-gray-600 whitespace-nowrap">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === "F"}
                      onChange={() => setFormData({ ...formData, gender: "F" })}
                      className="accent-gray-800"
                    />
                    女士
                  </label>
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-700">*聯絡電話</label>
                <input
                  type="tel"
                  placeholder="您的手機或市話"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2.5 border-b border-gray-300 text-base focus:outline-none focus:border-gray-800 transition-colors bg-transparent"
                />
              </div>
            </div>

            {/* Row 2: Email + License Plate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-base font-medium text-gray-700">*Email</label>
                <input
                  type="email"
                  placeholder="您的聯絡信箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2.5 border-b border-gray-300 text-base focus:outline-none focus:border-gray-800 transition-colors bg-transparent"
                />
              </div>
              <div>
                <label className="text-base font-medium text-gray-700">車牌號碼</label>
                <input
                  type="text"
                  placeholder="LEXUS 車主請輸入您的車牌號碼"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2.5 border-b border-gray-300 text-base focus:outline-none focus:border-gray-800 transition-colors bg-transparent"
                />
              </div>
            </div>

            {/* Row 3: Location + Contact Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-base font-medium text-gray-700">*所在區域</label>
                <div className="flex gap-3 mt-1.5">
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "" })}
                    className="flex-1 px-3 py-2.5 border-b border-gray-300 text-base focus:outline-none focus:border-gray-800 bg-transparent text-gray-700"
                  >
                    <option value="">縣市</option>
                    {taiwanCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="flex-1 px-3 py-2.5 border-b border-gray-300 text-base focus:outline-none focus:border-gray-800 bg-transparent text-gray-700"
                    disabled={!formData.city}
                  >
                    <option value="">鄉鎮市區</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-700">*方便聯絡時段</label>
                <div className="flex flex-wrap gap-4 mt-3">
                  {[
                    { value: "morning", label: "早上（8:00~12:00）" },
                    { value: "afternoon", label: "下午（12:00~18:00）" },
                    { value: "evening", label: "晚上（18:00~20:00）" },
                  ].map((time) => (
                    <label key={time.value} className="flex items-center gap-1.5 text-base text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.contactTime.includes(time.value)}
                        onChange={() => handleTimeToggle(time.value)}
                        className="accent-gray-800"
                      />
                      {time.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-base font-medium text-gray-700">*意見內容</label>
              <textarea
                rows={5}
                placeholder="請詳細描述您的意見或問題，以便客服人員回覆與提供協助。"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              />
            </div>

            {/* Consent */}
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

            {/* Submit */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="bg-gray-900 text-white px-12 py-3 rounded font-medium text-base hover:bg-gray-800 transition-colors tracking-wide disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {submitMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                確定送出
              </button>
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

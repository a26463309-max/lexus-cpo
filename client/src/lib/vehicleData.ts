// LEXUS CPO Vehicle Data
export interface Vehicle {
  id: string;
  model: string;
  series: string;
  price: number; // 萬
  mileage: number; // 公里
  year: number;
  month: number;
  registrationYear: number;
  registrationMonth: number;
  warrantyDate: string;
  color: string;
  displacement: number; // cc
  location: string;
  image: string;
  images?: string[]; // 多張圖片
  isNew: boolean;
  engineType?: string;
  fuelType?: string;
  driveType?: string;
  seats?: number;
  description?: string;
  features: {
    exterior: string[];
    interior: string[];
    seat: string[];
    audioClimate: string[];
    safety: string[];
  };
}

// 真實 Lexus 車系圖片 (CDN)
const seriesImages: Record<string, string> = {
  LX: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-lx_320bb813.png",
  RX: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-rx_3031ace1.jpg",
  RZ: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-rz_2b144740.webp",
  NX: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-nx-official_e2234dba.jpg",
  UX: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-ux-official_64ac76a5.jpg",
  LBX: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-lbx_45af9739.webp",
  LS: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-ls-es_a58f54ae.jpg",
  GS: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-gs_138a9248.jpg",
  ES: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-es_d9213594.jpg",
  IS: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-is_97f9c4d4.jpg",
  CT: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-is_97f9c4d4.jpg",
  LC: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-lc_73de5a62.jpg",
  RC: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-rc_576d6563.webp",
  SC: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-gs_138a9248.jpg",
  LM: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-lm_67efb74b.jpg",
};

const seriesModels: Record<string, string[]> = {
  LX: ["LX 600"],
  RX: ["RX 350", "RX 300", "RX 350h", "RX 450h"],
  RZ: ["RZ 450e"],
  NX: ["NX200", "NX 250", "NX 350h", "NX 450h+"],
  UX: ["UX 200", "UX 250h"],
  LBX: ["LBX"],
  LS: ["LS 500", "LS 500h"],
  GS: ["GS 200t", "GS 300"],
  ES: ["ES 200", "ES 250", "ES 300h"],
  IS: ["IS 200t", "IS 300", "IS 300h"],
  CT: ["CT 200h"],
  LC: ["LC 500", "LC 500h"],
  RC: ["RC 200t", "RC 300"],
  SC: ["SC 430"],
  LM: ["LM 300h", "LM 350h"],
};

export const allSeries = Object.keys(seriesModels);

export function getSeriesImage(series: string): string {
  return seriesImages[series] || seriesImages["RX"];
}

export function getSeriesModels(series: string): string[] {
  return seriesModels[series] || [];
}

// 前台車輛資料 - 清空，由後台管理新增
export const vehicles: Vehicle[] = [];

export const taiwanCities = [
  "基隆市", "臺北市", "新北市", "宜蘭縣", "新竹市", "新竹縣", "桃園市",
  "苗栗縣", "臺中市", "彰化縣", "南投縣", "嘉義市", "嘉義縣", "雲林縣",
  "臺南市", "高雄市", "屏東縣", "臺東縣", "花蓮縣", "金門縣", "連江縣", "澎湖縣",
];

export const cityDistricts: Record<string, string[]> = {
  "臺北市": ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"],
  "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "土城區", "蘆洲區", "汐止區", "樹林區", "淡水區"],
  "桃園市": ["桃園區", "中壢區", "平鎮區", "八德區", "楊梅區", "蘆竹區", "龜山區", "大溪區"],
  "臺中市": ["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區", "豐原區"],
  "臺南市": ["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區", "新化區"],
  "高雄市": ["新興區", "前金區", "苓雅區", "鹽埕區", "鼓山區", "旗津區", "前鎮區", "三民區", "楠梓區", "小港區", "左營區"],
};

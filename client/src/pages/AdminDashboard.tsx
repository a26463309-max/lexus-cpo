import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Car,
  ClipboardList,
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  X,
  Loader2,
  Upload,
  GripVertical,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

type Tab = "vehicles" | "appraisals" | "contacts";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "待處理", color: "bg-yellow-100 text-yellow-800" },
  contacted: { label: "已聯絡", color: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", color: "bg-gray-100 text-gray-600" },
};

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("vehicles");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.login.useMutation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LayoutDashboard size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">後台管理系統</h2>
          <p className="text-gray-500 mb-6">請先登入以存取管理功能</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await loginMutation.mutateAsync({ password });
              if (result.success) {
                setPassword("");
                window.location.reload();
                return;
              }
              toast.error(result.message ?? "登入失敗");
            }}
            className="flex flex-col items-center gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入管理密碼"
              className="w-64 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={loginMutation.isPending || !password.trim()}
              className="inline-block bg-[#0a0a0a] text-white px-6 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loginMutation.isPending ? "登入中..." : "登入"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">權限不足</h2>
          <p className="text-gray-500 mb-6">您沒有管理員權限，請聯繫系統管理員</p>
          <Link
            href="/"
            className="inline-block bg-[#0a0a0a] text-white px-6 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a0a0a] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-lg font-semibold tracking-wider">
                LEXUS CPO 後台管理
              </h1>
              <p className="text-xs text-gray-400">管理車輛、鑑價申請、聯絡表單</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.name || "管理員"}</span>
            <button
              onClick={() => logout()}
              className="text-gray-400 hover:text-white transition-colors"
              title="登出"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            <TabButton active={activeTab === "vehicles"} onClick={() => setActiveTab("vehicles")} icon={<Car size={16} />} label="車輛管理" />
            <TabButton active={activeTab === "appraisals"} onClick={() => setActiveTab("appraisals")} icon={<ClipboardList size={16} />} label="鑑價申請" />
            <TabButton active={activeTab === "contacts"} onClick={() => setActiveTab("contacts")} icon={<MessageSquare size={16} />} label="聯絡表單" />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "vehicles" && <VehiclesTab />}
        {activeTab === "appraisals" && <AppraisalsTab />}
        {activeTab === "contacts" && <ContactsTab />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
        active ? "border-[#0a0a0a] text-[#0a0a0a]" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ===== VEHICLES TAB =====
function VehiclesTab() {
  const utils = trpc.useUtils();
  const { data: vehiclesList, isLoading } = trpc.admin.vehicles.list.useQuery();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const deleteMutation = trpc.admin.vehicles.delete.useMutation({
    onSuccess: () => {
      utils.admin.vehicles.list.invalidate();
      toast.success("車輛已刪除");
    },
    onError: (err) => toast.error("刪除失敗: " + err.message),
  });

  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
  };

  const openEdit = (id: number) => {
    setModalMode("edit");
    setEditingId(id);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    utils.admin.vehicles.list.invalidate();
  };

  const editingVehicle = editingId && vehiclesList ? vehiclesList.find((v: any) => v.id === editingId) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          車輛列表 {vehiclesList && <span className="text-gray-400 text-sm font-normal">({vehiclesList.length} 輛)</span>}
        </h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded"
        >
          <Plus size={16} />
          新增車輛
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto text-gray-400" size={24} />
        </div>
      ) : vehiclesList && vehiclesList.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">圖片</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">車系</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">車型</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">年份</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">價格(萬)</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">里程</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">據點</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">照片數</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehiclesList.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.model} className="w-16 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{v.series}</td>
                    <td className="px-4 py-3 font-medium">{v.model}</td>
                    <td className="px-4 py-3">{v.year}年{v.month}月</td>
                    <td className="px-4 py-3 font-semibold">{v.price}</td>
                    <td className="px-4 py-3">{v.mileage?.toLocaleString()}</td>
                    <td className="px-4 py-3">{v.location}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{v.images?.length || 0} 張</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${v.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {v.isActive ? "上架" : "下架"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(v.id)} className="text-gray-400 hover:text-blue-600 transition-colors" title="編輯">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("確定要刪除此車輛嗎？")) {
                              deleteMutation.mutate({ id: v.id });
                            }
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="刪除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Car size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">尚無車輛資料</p>
          <p className="text-sm text-gray-400 mt-1">點擊「新增車輛」開始建立車輛庫存</p>
        </div>
      )}

      {/* Unified Create/Edit Modal */}
      {modalMode === "create" && (
        <VehicleModal mode="create" onClose={closeModal} />
      )}
      {modalMode === "edit" && editingVehicle && (
        <VehicleModal mode="edit" vehicle={editingVehicle} onClose={closeModal} />
      )}
    </div>
  );
}

// ===== UNIFIED VEHICLE MODAL (Create + Edit with image upload) =====
function VehicleModal({ mode, vehicle, onClose }: {
  mode: "create" | "edit";
  vehicle?: any;
  onClose: () => void;
}) {
  const utils = trpc.useUtils();
  const isCreate = mode === "create";

  // Vehicle ID: for edit mode it's the existing id, for create mode it's set after first save
  const [vehicleId, setVehicleId] = useState<number | null>(vehicle?.id || null);
  const [saved, setSaved] = useState(!isCreate); // edit mode starts as "saved"

  const [form, setForm] = useState({
    series: vehicle?.series || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    month: vehicle?.month || 1,
    color: vehicle?.color || "",
    mileage: vehicle?.mileage || 0,
    price: vehicle?.price || 0,
    location: vehicle?.location || "CPO 南港所",
    engineType: vehicle?.engineType || "",
    displacement: vehicle?.displacement || "",
    fuelType: vehicle?.fuelType || "",
    driveType: vehicle?.driveType || "",
    seats: vehicle?.seats || 5,
    description: vehicle?.description || "",
    isActive: vehicle?.isActive ?? 1,
  });

  const [images, setImages] = useState<any[]>(vehicle?.images || []);
  const [uploading, setUploading] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pending files selected before vehicle is created
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  const createMutation = trpc.admin.vehicles.create.useMutation({
    onSuccess: async (result) => {
      if (result?.insertId) {
        setVehicleId(result.insertId);
        setSaved(true);
        toast.success("車輛資料已建立，正在上傳照片...");
        utils.admin.vehicles.list.invalidate();
      }
    },
    onError: (err) => toast.error("新增失敗: " + err.message),
  });

  const updateMutation = trpc.admin.vehicles.update.useMutation({
    onSuccess: () => {
      toast.success("車輛資料已更新");
    },
    onError: (err) => toast.error("更新失敗: " + err.message),
  });

  const uploadMutation = trpc.admin.images.upload.useMutation({
    onSuccess: (result) => {
      setImages(prev => [...prev, { id: result.imageId, imageUrl: result.url, sortOrder: result.sortOrder }]);
      utils.admin.vehicles.list.invalidate();
    },
    onError: (err) => toast.error("上傳失敗: " + err.message),
  });

  const deleteMutation = trpc.admin.images.delete.useMutation({
    onSuccess: (_, variables) => {
      setImages(prev => prev.filter(img => img.id !== variables.imageId));
      utils.admin.vehicles.list.invalidate();
      toast.success("照片已刪除");
    },
    onError: (err) => toast.error("刪除失敗: " + err.message),
  });

  const reorderMutation = trpc.admin.images.reorder.useMutation({
    onSuccess: () => {
      utils.admin.vehicles.list.invalidate();
    },
    onError: (err) => toast.error("排序失敗: " + err.message),
  });

  // Upload pending files once vehicleId is available
  useEffect(() => {
    if (vehicleId && pendingFiles.length > 0) {
      uploadPendingFiles(vehicleId, pendingFiles);
      setPendingFiles([]);
      setPendingPreviews([]);
    }
  }, [vehicleId]);

  const uploadPendingFiles = async (vId: number, files: File[]) => {
    setUploading(true);
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        await uploadMutation.mutateAsync({
          vehicleId: vId,
          base64,
          mimeType: file.type,
          fileName: file.name,
        });
      } catch {
        // Error handled by mutation
      }
    }
    setUploading(false);
    toast.success(`${files.length} 張照片上傳完成`);
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} 不是圖片檔案`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} 超過 10MB 限制`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (vehicleId) {
      // Vehicle already exists, upload directly
      setUploading(true);
      for (const file of validFiles) {
        try {
          const base64 = await fileToBase64(file);
          await uploadMutation.mutateAsync({
            vehicleId,
            base64,
            mimeType: file.type,
            fileName: file.name,
          });
        } catch {
          // Error handled by mutation
        }
      }
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      // Vehicle not yet created, store as pending with previews
      setPendingFiles(prev => [...prev, ...validFiles]);
      // Generate previews
      for (const file of validFiles) {
        const reader = new FileReader();
        reader.onload = () => {
          setPendingPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [vehicleId, uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Image reorder via drag
  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex || !vehicleId) return;

    const newImages = [...images];
    const [dragged] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, dragged);
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Save new order to backend
    reorderMutation.mutate({
      vehicleId,
      imageIds: newImages.map(img => img.id),
    });
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
    setPendingPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.series || !form.model || !form.color || !form.location) {
      toast.error("請填寫必填欄位（車系、車型、車色、展示據點）");
      return;
    }

    if (isCreate && !vehicleId) {
      // First time save: create vehicle, then upload pending files
      createMutation.mutate({
        series: form.series,
        model: form.model,
        year: form.year,
        month: form.month,
        color: form.color,
        mileage: form.mileage,
        price: form.price,
        location: form.location,
        engineType: form.engineType || undefined,
        displacement: form.displacement || undefined,
        fuelType: form.fuelType || undefined,
        driveType: form.driveType || undefined,
        seats: form.seats || undefined,
        description: form.description || undefined,
      });
    } else if (vehicleId) {
      // Update existing vehicle
      updateMutation.mutate({ id: vehicleId, data: form });
    }
  };

  const totalImages = images.length + pendingPreviews.length;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-semibold text-gray-900">
            {isCreate ? (vehicleId ? `新增車輛 #${vehicleId} - 繼續編輯` : "新增車輛") : `編輯車輛 #${vehicle?.id} - ${vehicle?.model}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Step indicator for create mode */}
          {isCreate && !vehicleId && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>提示：</strong>您可以先上傳照片，再填寫車輛資料。按下「儲存」後照片會自動上傳。
              </p>
            </div>
          )}

          {/* Image Upload Section - FIRST */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ImageIcon size={18} />
              車輛照片 <span className="text-sm font-normal text-gray-400">({totalImages} 張，建議至少上傳 10 張)</span>
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              {vehicleId
                ? "拖曳照片可調整順序，第一張為封面照片。支援 JPG、PNG、WebP 格式，單張不超過 10MB。"
                : "先選擇照片，儲存車輛資料後會自動上傳。支援 JPG、PNG、WebP 格式，單張不超過 10MB。"
              }
            </p>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer mb-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">上傳中...</span>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-600">拖曳照片到此處，或點擊選擇檔案</p>
                  <p className="text-xs text-gray-400 mt-1">可一次選擇多張照片</p>
                </>
              )}
            </div>

            {/* Pending Previews (before vehicle is created) */}
            {pendingPreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-amber-600 mb-2">以下照片將在儲存車輛資料後自動上傳：</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {pendingPreviews.map((preview, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-amber-300">
                      <div className="aspect-[4/3]">
                        <img src={preview} alt={`待上傳 ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePendingFile(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="absolute top-1 left-1 bg-amber-400 text-xs text-white px-1.5 py-0.5 rounded font-medium">
                        待上傳
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Image Grid (Draggable) */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.map((img: any, index: number) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleImageDragStart(index)}
                    onDragOver={(e) => handleImageDragOver(e, index)}
                    onDrop={(e) => handleImageDrop(e, index)}
                    onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                      dragOverIndex === index ? "border-blue-400 scale-105" : draggedIndex === index ? "border-gray-400 opacity-50" : "border-gray-200"
                    } ${index === 0 ? "ring-2 ring-amber-400" : ""}`}
                  >
                    <div className="aspect-[4/3]">
                      <img src={img.imageUrl} alt={`照片 ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                        <GripVertical size={16} className="text-white" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("確定要刪除此照片嗎？")) {
                              deleteMutation.mutate({ imageId: img.id, vehicleId: vehicleId! });
                            }
                          }}
                          className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {/* Badge */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-amber-400 text-xs text-white px-1.5 py-0.5 rounded font-medium">
                        封面
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info Form */}
          <h4 className="font-semibold text-gray-900 mb-4">車輛資料</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="車系" value={form.series} onChange={(v) => setForm({ ...form, series: v })} required placeholder="如: RX" />
            <FormField label="車型" value={form.model} onChange={(v) => setForm({ ...form, model: v })} required placeholder="如: RX 350h" />
            <FormField label="出廠年份" type="number" value={form.year} onChange={(v) => setForm({ ...form, year: Number(v) })} required />
            <FormField label="出廠月份" type="number" value={form.month} onChange={(v) => setForm({ ...form, month: Number(v) })} required />
            <FormField label="車色" value={form.color} onChange={(v) => setForm({ ...form, color: v })} required placeholder="如: 極光白" />
            <FormField label="里程(公里)" type="number" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: Number(v) })} required />
            <FormField label="價格(萬)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
            <FormField label="展示據點" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required />
            <FormField label="引擎型式" value={form.engineType} onChange={(v) => setForm({ ...form, engineType: v })} />
            <FormField label="排氣量" value={form.displacement} onChange={(v) => setForm({ ...form, displacement: v })} />
            <FormField label="燃料類型" value={form.fuelType} onChange={(v) => setForm({ ...form, fuelType: v })} />
            <FormField label="驅動方式" value={form.driveType} onChange={(v) => setForm({ ...form, driveType: v })} />
            <FormField label="座位數" type="number" value={form.seats} onChange={(v) => setForm({ ...form, seats: Number(v) })} />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">上架狀態</label>
              <select
                value={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value={1}>上架</option>
                <option value={0}>下架</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving || uploading}
              className="flex items-center gap-2 bg-[#0a0a0a] text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 rounded"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isCreate && !vehicleId ? "儲存並上傳照片" : "儲存變更"}
            </button>
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
              {isCreate && !vehicleId ? "取消" : "關閉"}
            </button>
            {pendingFiles.length > 0 && !vehicleId && (
              <span className="text-xs text-amber-600">
                {pendingFiles.length} 張照片待上傳
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", required = false, placeholder }: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/xxx;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===== APPRAISALS TAB =====
function AppraisalsTab() {
  const utils = trpc.useUtils();
  const { data: appraisals, isLoading } = trpc.admin.appraisals.list.useQuery();
  const updateStatus = trpc.admin.appraisals.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.appraisals.list.invalidate();
      toast.success("狀態已更新");
    },
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin mx-auto text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        鑑價申請 {appraisals && <span className="text-gray-400 text-sm font-normal">({appraisals.length} 筆)</span>}
      </h2>

      {appraisals && appraisals.length > 0 ? (
        <div className="space-y-4">
          {appraisals.map((a: any) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Summary Row */}
              <div
                className="px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-wrap">
                    <span className="text-xs text-gray-400">#{a.id}</span>
                    <span className="font-medium text-gray-900">{a.name}</span>
                    <span className="text-gray-600">{a.phone}</span>
                    <span className="text-gray-600">{a.brand} {a.model}</span>
                    <span className="text-gray-500">{a.year}年 / {a.mileage}km</span>
                    <span className="text-gray-500">{a.relation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={a.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus.mutate({ id: a.id, status: e.target.value as any })}
                      className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${statusLabels[a.status]?.color || ""}`}
                    >
                      <option value="pending">待處理</option>
                      <option value="contacted">已聯絡</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                    <span className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleString("zh-TW")}
                    </span>
                    <ChevronLeft
                      size={16}
                      className={`text-gray-400 transition-transform ${expandedId === a.id ? "-rotate-90" : "rotate-0"}`}
                    />
                  </div>
                </div>
                {a.notes && (
                  <p className="text-xs text-gray-500 mt-2 truncate max-w-[600px]">備註：{a.notes}</p>
                )}
              </div>

              {/* Expanded Detail with Images */}
              {expandedId === a.id && (
                <AppraisalDetail appraisalId={a.id} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">尚無鑑價申請</p>
        </div>
      )}
    </div>
  );
}

function AppraisalDetail({ appraisalId }: { appraisalId: number }) {
  const { data: images, isLoading } = trpc.admin.appraisals.getImages.useQuery({ appraisalId });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <ImageIcon size={16} />
        上傳圖片
      </h4>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="animate-spin" size={16} />
          載入中...
        </div>
      ) : images && images.length > 0 ? (
        <>
          {/* License images */}
          {images.filter((img: any) => img.imageType === "license").length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">行照</p>
              <div className="flex flex-wrap gap-3">
                {images.filter((img: any) => img.imageType === "license").map((img: any) => (
                  <div
                    key={img.id}
                    className="relative group cursor-pointer"
                    onClick={() => setPreviewUrl(img.imageUrl)}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.fileName || "行照"}
                      className="w-32 h-24 object-cover rounded border border-gray-200 hover:border-gray-400 transition-colors"
                    />
                    <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                      {img.fileName || "行照"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle images */}
          {images.filter((img: any) => img.imageType === "vehicle").length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">車輛照片</p>
              <div className="flex flex-wrap gap-3">
                {images.filter((img: any) => img.imageType === "vehicle").map((img: any) => (
                  <div
                    key={img.id}
                    className="relative group cursor-pointer"
                    onClick={() => setPreviewUrl(img.imageUrl)}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.fileName || "車輛照片"}
                      className="w-32 h-24 object-cover rounded border border-gray-200 hover:border-gray-400 transition-colors"
                    />
                    <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                      {img.fileName || "車輛照片"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full-size preview modal */}
          {previewUrl && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewUrl(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh]">
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <X size={24} />
                </button>
                <img
                  src={previewUrl}
                  alt="預覽"
                  className="max-w-full max-h-[85vh] object-contain rounded"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400">此申請未上傳圖片</p>
      )}
    </div>
  );
}

// ===== CONTACTS TAB =====
function ContactsTab() {
  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.admin.contacts.list.useQuery();
  const updateStatus = trpc.admin.contacts.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.contacts.list.invalidate();
      toast.success("狀態已更新");
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin mx-auto text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        聯絡表單 {contacts && <span className="text-gray-400 text-sm font-normal">({contacts.length} 筆)</span>}
      </h2>

      {contacts && contacts.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">姓名</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">電話</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">車牌</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">地區</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">聯絡時段</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">訊息</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">提交時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{c.id}</td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3">{c.email || "-"}</td>
                    <td className="px-4 py-3">{c.licensePlate || "-"}</td>
                    <td className="px-4 py-3">{c.city ? `${c.city} ${c.district || ""}` : "-"}</td>
                    <td className="px-4 py-3">{c.contactTime || "-"}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{c.message || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value as any })}
                        className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${statusLabels[c.status]?.color || ""}`}
                      >
                        <option value="pending">待處理</option>
                        <option value="contacted">已聯絡</option>
                        <option value="completed">已完成</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(c.createdAt).toLocaleString("zh-TW")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">尚無聯絡表單提交</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/crop";
import { upload } from "@/utils/upload";
import { database } from "@/utils/database";
import { Loader2, X } from "lucide-react";

const EditProfile = ({ userData, setEditOpen }) => {
  const [newIcon, setNewIcon] = useState(userData.icon);
  const [newBanner, setNewBanner] = useState(userData.banner);
  const [bio, setBio] = useState(userData.bio || "");
  const [address, setAddress] = useState(userData.address || "");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [cropping, setCropping] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [croppingLoading, setCroppingLoading] = useState(false);

  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleFilePreview = (event, setPreview, setImage) => {
    const file = event.target.files[0];
    if (!file) return;
    setCropping({ file, setPreview, setImage });
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!cropping) return;
    setCroppingLoading(true);
    const croppedImage = await getCroppedImg(cropping.file, croppedAreaPixels);
    const previewUrl = URL.createObjectURL(croppedImage);
    cropping.setPreview(previewUrl);
    cropping.setImage(croppedImage);
    setCropping(null);
    setCroppingLoading(false);
  };

  const handleUpdateAddress = () => {
    setLoadingAddress(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setAddress(data.display_name);
          setLoadingAddress(false);
        },
        () => {
          setLoadingAddress(false);
        }
      );
    } else {
      setLoadingAddress(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    const clientUID = localStorage.getItem("clientUID");
    if (!clientUID) return;

    let finalIcon = newIcon;
    let finalBanner = newBanner;

    if (previewIcon) finalIcon = await upload(previewIcon);
    if (previewBanner) finalBanner = await upload(previewBanner);

    await database.updateUser(clientUID, {
      bio,
      address,
      icon: finalIcon,
      banner: finalBanner,
      ban: false
    });

    setUpdating(false);
    setEditOpen(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#0f0f0f] p-6 rounded-lg shadow-lg w-96 relative animate-fade-in">
        <button onClick={() => setEditOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center text-white">Edit Profile</h2>

        <div
          className="relative w-full h-32 bg-[#262626] rounded-lg overflow-hidden flex justify-center items-center cursor-pointer"
          onClick={() => bannerInputRef.current?.click()}
        >
          {previewBanner ? (
            <img src={previewBanner} className="w-full h-full object-cover" />
          ) : newBanner ? (
            <img src={newBanner} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white">Upload Banner</span>
          )}
          <input type="file" accept="image/*" ref={bannerInputRef} className="hidden" onChange={(e) => handleFilePreview(e, setPreviewBanner, setNewBanner)} />
        </div>

        <div className="flex justify-center -mt-12 relative">
          <div className="w-24 h-24 rounded-full border-4 border-gray-900 bg-[#262626] overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => iconInputRef.current?.click()}>
            {previewIcon ? (
              <img src={previewIcon} className="w-full h-full object-cover" />
            ) : newIcon ? (
              <img src={newIcon} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Upload Icon</span>
            )}
          </div>
          <input type="file" accept="image/*" ref={iconInputRef} className="hidden" onChange={(e) => handleFilePreview(e, setPreviewIcon, setNewIcon)} />
        </div>

        <input type="text" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-[#262626] text-white p-2 rounded-md mt-4" />

        {address ? (
          <div className="w-full bg-[#262626] text-white p-2 rounded-md mt-4 text-center">{address}</div>
        ) : (
          <button onClick={handleUpdateAddress} className="w-full bg-[#262626] hover:bg-[#0f0f0f] text-white py-2 rounded-md mt-4 flex items-center justify-center">
            {loadingAddress ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update My Address"}
          </button>
        )}

        <button onClick={handleUpdate} className="w-full bg-[#262626] hover:bg-[#0f0f0f] py-2 rounded-md flex items-center justify-center mt-6 transition">
          {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
        </button>
      </div>

      {cropping && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">Crop Image</h2>
            <div className="relative w-full h-96 bg-[#262626]">
              <Cropper
                image={URL.createObjectURL(cropping.file)}
                crop={crop}
                zoom={zoom}
                aspect={cropping.setImage === setNewIcon ? 1 : 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setCropping(null)} className="bg-[#262626] text-white py-2 px-4 rounded-md">Cancel</button>
              <button onClick={handleCropConfirm} className="bg-[#262626] py-2 px-4 rounded-md flex items-center justify-center">
                {croppingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;

"use client";

import ChangeNameAndEmail from "@/components/customComp/ChangeNameAndEmail";
import ChangePassword from "@/components/customComp/ChangePassword";
import ChangeAvatar from "@/components/customComp/ChnageAvatar";

export default function ChangeDetails() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information and security
        </p>
      </div>

      {/* Settings Cards */}
      <div className="max-w-3xl mx-auto space-y-6 ">
        {/* Name & Email */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-medium">Profile Information</h2>
          <p className="text-sm text-gray-500 mb-4">
            Update your name and email address
          </p>
          <ChangeNameAndEmail />
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-medium">Profile Picture</h2>
          <p className="text-sm text-gray-500 mb-4">
            Change how your profile appears to others
          </p>
          <ChangeAvatar />
        </div>

        {/* Password (Security Section) */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
          <h2 className="text-lg font-medium text-red-600">Security</h2>
          <p className="text-sm text-gray-500 mb-4">
            Change your password to keep your account secure
          </p>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}

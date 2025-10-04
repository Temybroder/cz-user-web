"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { MapPin, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import AddNewAddressModal from "./add-new-address-modal"
import { useAppContext } from "@/context/app-context"
import Loader from "@/app/components/loader"

export default function AddressModal({ isOpen, onClose, onSelectAddress, isRegistration = false }) {
  const { addresses, selectedAddress } = useAppContext()
  const [isAddNewAddressModalOpen, setIsAddNewAddressModalOpen] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(
    selectedAddress ? selectedAddress.id : addresses.length > 0 ? addresses[0].id : null,
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)

    try {
      const address = addresses.find((addr) => addr.id === selectedAddressId)
      if (address) {
        onSelectAddress(address)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNewAddressSuccess = (newAddress) => {
    setIsAddNewAddressModalOpen(false)
    setSelectedAddressId(newAddress.id)
    // Address is automatically added to addresses list by context
    // Automatically select and use the new address for checkout
    if (onSelectAddress) {
      onSelectAddress(newAddress)
      onClose() // Close the address modal after selecting new address
    }
  }

  const handleSkip = () => {
    if (isRegistration) {
      onSelectAddress(null)
    } else {
      onClose()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-bold text-center">
            {isRegistration ? "Add a delivery address" : "Delivery address"}
          </DialogTitle>

          {isRegistration && (
            <p className="text-center text-gray-500 mt-2">Add a delivery address to get started with ordering</p>
          )}

          <div className="mt-6">
            {addresses.length > 0 ? (
              <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`flex items-start p-4 border rounded-lg ${
                      selectedAddressId === address.id ? "border-primary bg-orange-50" : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`address-${address.id}`} className="font-medium">
                          {address.name}
                        </Label>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{address.fullAddress}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <MapPin className="w-12 h-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No addresses found</p>
              </div>
            )}

            <Button
              variant="outline"
              className="flex items-center justify-center w-full gap-2 mt-6"
              onClick={() => setIsAddNewAddressModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add new address
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              {isRegistration && (
                <Button variant="outline" className="w-full" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}

              <Button
                className="w-full gradient-button"
                onClick={handleContinue}
                disabled={!selectedAddressId || isLoading}
              >
                {isLoading ? <Loader /> : "Continue"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddNewAddressModal
        isOpen={isAddNewAddressModalOpen}
        onClose={() => setIsAddNewAddressModalOpen(false)}
        onSuccess={handleAddNewAddressSuccess}
      />
    </>
  )
}

import { useToast as useToastPrimitive } from "@/hooks/use-toast"

export const useToast = () => {
  const toast = useToastPrimitive()
  return toast
}

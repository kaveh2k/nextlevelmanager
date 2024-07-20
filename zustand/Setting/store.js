
import { create } from 'zustand';


const useStoreSettings = create((set) => ({
    logo: '', // Store the logo base64 string
    setLogo: (logo) => set({ logo: logo })
}))

module.exports = useStoreSettings
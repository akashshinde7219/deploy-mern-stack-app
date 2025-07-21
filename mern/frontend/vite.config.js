import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: 'a5db7f63410944106b7170cb109eca00-87888423.us-east-1.elb.amazonaws.com'
  }
})

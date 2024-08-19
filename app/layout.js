import { Inter } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import { LoadingProvider } from "@/context/LoadingContext";
import Layout from "@/components/Layout/Layout";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Om Tractors",
  description: "Om Tractors Record",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{backgroundColor: "#effaff"}}>
        <NextTopLoader
          color="#FF9F43"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={100}
          shadow="0 0 10px #FF9F43,0 0 5px #FF9F43"
        />
        <LoadingProvider>
          <SidebarProvider>
            <Layout>
              <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              {children}
              <section className="my-[10vh]"></section>
            </Layout>
          </SidebarProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}

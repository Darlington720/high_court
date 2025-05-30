import React, { useContext, useEffect, useRef, useState } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { Modal, Alert, Button, Typography } from "antd";
import AppContext from "../context/AppContext";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { supabase } from "../lib/supabase";
import { url1 } from "../lib/apiUrls";
import { Download } from "lucide-react";

function DocumentPreview({
  documentUrl,
  documentDetails,
}: {
  documentUrl: string;
  documentDetails: any;
}) {
  const appContext = useContext(AppContext);
  const [loadError, setLoadError] = useState(false);
  const hasSavedView = useRef(false);

  //   console.log(appContext?.user);

  // Initialize toolbar plugin
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar, renderDefaultToolbar } = toolbarPluginInstance;

  const transform = (slot) => {
    const { Download, NumberOfPages } = slot;
    return Object.assign({}, slot, {
      Download: () => (
        <a
          href={`${url1}/api/download?url=${documentUrl}&name=${documentDetails.title}`}
          download={documentDetails.title}
          onClick={() => saveDocumentDownload()}
          // className="rpv-core__button"
          style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
        >
          {/* <Download onClick={() => null} /> */}
          <Download
            size={18}
            style={{
              marginBottom: 6,
            }}
          />
        </a>
      ),
    });
  };

  // Function to check if the file is a PDF
  const isValidPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

  const saveDocumentView = async () => {
    const { data: documentViewData, error: documentViewErr } = await supabase
      .from("document_views")
      .insert([
        { user_id: appContext?.user?.id, document_id: documentDetails.id },
      ])
      .select();

    if (documentViewErr) {
      console.error("Error saving document view", documentViewErr);
    }
  };

  const saveDocumentDownload = async () => {
    const { data, error } = await supabase.from("downloads").insert([
      {
        user_id: appContext?.user?.id,
        document_id: documentDetails.id,
      },
    ]);

    if (error) {
      console.error("Error saving document download:", error);
    }
  };

  useEffect(() => {
    if (!hasSavedView.current) {
      saveDocumentView();
      hasSavedView.current = true;
    }
  }, [documentUrl]);

  return (
    <Modal
      title={
        <Typography.Title
          level={5}
          style={{
            width: "95%",
          }}
        >
          {`${documentDetails?.title}`}
        </Typography.Title>
      }
      style={{ top: 20 }}
      width={700}
      open={appContext?.selectedDocumentPreviewVisible}
      onCancel={() => appContext?.setSelectedDocumentPreviewVisible(false)}
      footer={null}
    >
      <div className="flex flex-col items-center gap-4">
        {/* If the file is not a valid PDF, show an error message */}
        {!isValidPDF(documentUrl) || loadError ? (
          <div className="w-full">
            <Alert
              message="Unsupported Document"
              description="This file format is not supported for preview. Please download the document to view it."
              type="error"
              showIcon
            />
            <div className="text-center mt-4">
              <Button
                type="primary"
                href={documentUrl}
                download
                onClick={() => {
                  saveDocumentDownload();
                }}
              >
                Download Document
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar for PDF Controls */}
            <div className="w-full border p-2 bg-gray-100 rounded-lg">
              {/* <Toolbar /> */}
              <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
            </div>

            {/* PDF Viewer */}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.3)",
                  height: "calc(100vh - 200px)",
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <Viewer
                  fileUrl={documentUrl}
                  plugins={[toolbarPluginInstance]}
                  onError={() => setLoadError(true)}
                />
              </div>
            </Worker>
          </>
        )}
      </div>
    </Modal>
  );
}

export default DocumentPreview;

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import faceNotDetected from "../../assets/img/face_not_detected.jpg";
import ReactLoading from "react-loading";
import { Typography, useTheme } from "@mui/material";

// Interface para as propriedades da imagem
interface ImageProps {
  url: string; // URL da imagem
  width: number; // Largura da imagem
  height: number; // Altura da imagem
  newBlobUrl?: string;
}

// Interface para as propriedades do rosto detectado
interface FriendsProps {
  face?: {
    blobUrl: string; // URL da imagem do rosto detectado
    srcset: string;
  };
}

// Interface para a imagem enviada
interface UpImage {
  url: string;
  width: number;
  height: number;
}

// Componente para criar uma nova postagem
export const NewPost = ({
  image,
  handleResult,
}: {
  image: ImageProps;
  handleResult: (upImage: UpImage) => void;
}) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState<number[][]>([]);
  const [friends, setFriends] = useState<FriendsProps>({});
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const croppedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showMessage, setShowMessage] = useState(false);
  const theme = useTheme();

  // Função para lidar com a imagem e detectar os rostos
  const handleImage = async () => {
    if (imgRef.current) {
      const detections = await faceapi.detectAllFaces(
        imgRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      setFaces(detections.map((d) => Object.values(d.box) as number[]));
    }
  };

  // Carregar os modelos de detecção de rosto e lidar com a imagem ao montar o componente
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        // faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);

      imgRef.current && handleImage();
    };

    loadModels();
  }, []);

  // Desenhar retângulos ao redor dos rostos detectados no canvas
  useEffect(() => {
    const drawFaces = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        faces.map((face) => ctx.strokeRect(face[0], face[1], face[2], face[3]));
      }
    };

    // Recortar e criar um novo canvas para o rosto detectado
    const drawCropped = () => {
      if (faces.length > 0) {
        var [x, y, w, h] = faces[0];
        y = y - 0.4 * w;
        h = 1.4 * w;
        const img = imgRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx && img) {
            canvas.width = 295;
            canvas.height = 412;
            ctx.drawImage(img, x, y, w, h, 0, 0, 295, 412);
            const newCanvas = document.createElement("canvas");
            const newCtx = newCanvas.getContext("2d");
            const newWidth2 = 295;
            const newHeight2 = 412;
            newCanvas.width = newWidth2;
            newCanvas.height = newHeight2;
            if (newCtx) {
              newCtx.drawImage(canvas, 0, 0, newWidth2, newHeight2);
              newCanvas.toBlob(
                (blob) => {
                  if (blob) {
                    const newFile = new File([blob], "image.jpg", {
                      type: blob.type,
                    });
                    const newBlobUrl = URL.createObjectURL(newFile);
                    handleResult({
                      url: newBlobUrl,
                      width: newCanvas.width,
                      height: newCanvas.height,
                    });
                    setFriends((prev) => ({
                      ...prev,
                      face: { blobUrl: newBlobUrl, srcset: "" },
                    }));
                  }
                },
                "image/jpeg",
                1.0
              );
            }
          }
        }
      }
    };

    drawFaces();
    drawCropped();
  }, [faces]);

  // Configurar um timer para exibir uma mensagem se nenhum rosto for detectado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!friends.face) {
        setShowMessage(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [friends.face]);

  return (
    <div className="container">
      {!showMessage ? (
        <div
          className="left"
          style={{ width, height, display: friends.face ? "none" : "none" }}
        >
          <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
          <canvas ref={canvasRef} width={width} height={height}></canvas>
          <canvas ref={croppedCanvasRef} style={{ display: "none" }}></canvas>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={faceNotDetected}
            alt=""
            style={{ width: "295px", height: "412px" }}
          />
          <Typography>
            <p>Sem rosto detectado</p>
          </Typography>
        </div>
      )}
      {friends.face ? (
        <img src={friends.face.blobUrl} alt="" srcSet={friends.face.srcset} />
      ) : (
        <div
          style={{
            marginTop: theme.spacing(2),
            display: showMessage ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ReactLoading
            type={"spin"}
            color={"#000000"}
            height={50}
            width={50}
          />
          <Typography>
            <p>Detectando o rosto...</p>
          </Typography>
        </div>
      )}
    </div>
  );
};

// import { useEffect, FC, ReactElement } from 'react'
// import { Html5Qrcode } from 'html5-qrcode'
// import { useQRScanner } from '@/hooks/useQRScanner'
// import ErrorMessage from '@/pages/QRScanner/components/ErrorMessage'
// import PermissionRequest from '@/pages/QRScanner/components/PermissionRequest'
// import ScannerHeader from '@/pages/QRScanner/components/ScannerHeader'
// import ScannerContent from '@/pages/QRScanner/components/ScannerContent'
// import ScanningGuide from '@/pages/QRScanner/components/ScanningGuide'
// import '@/styles/QRScanner.css'

// const QRScanner: FC = (): ReactElement => {
//   const {
//     permissionGranted,
//     scanning,
//     error,
//     qrReaderRef,
//     clearError,
//     stopScanner,
//     onScanSuccess,
//     onScanFailure,
//   } = useQRScanner()

//   // QR 스캐너 초기화 효과
// // QR 스캐너 초기화 효과
// useEffect((): (() => void) => {
//   try {
//     console.log("QR 스캐너 useEffect 시작, scanning:", scanning, "ref exists:", !!qrReaderRef.current)
    
//     // 스캐닝 중이고 DOM 요소가 존재할 때만 초기화
//     if (scanning && qrReaderRef.current) {
//       // 기존 내용 초기화
//       qrReaderRef.current.innerHTML = ''
      
//       // 직접 비디오 요소 생성 및 추가
//       const videoElem = document.createElement('video');
//       videoElem.style.width = '100%';
//       videoElem.style.height = '100%';
//       videoElem.style.objectFit = 'cover';
//       videoElem.setAttribute('playsinline', 'true');
//       videoElem.id = 'qr-video-element';
//       qrReaderRef.current.appendChild(videoElem);
      
//       console.log("직접 비디오 요소 생성: ", videoElem);
      
//       // 요소에 ID 할당
//       const qrReaderId = 'qr-reader-element';
//       qrReaderRef.current.id = qrReaderId;
      
//       console.log("HTML5QrCode 인스턴스 생성 시작");
//       const html5QrCode = new Html5Qrcode(qrReaderId, { 
//         verbose: true, // 자세한 로깅을 위해 verbose 옵션 활성화
//         experimentalFeatures: {
//           useBarCodeDetectorIfSupported: true
//         }
//       });
//       console.log("HTML5QrCode 인스턴스 생성 완료");

//       // 스캐너 설정 변경
//       const config = {
//         fps: 10,
//         qrbox: { width: 250, height: 250 },
//         aspectRatio: 1.0,
//         disableFlip: false,
//         formatsToSupport: ['QR_CODE'],
//         rememberLastUsedCamera: true
//       };

//       // 비디오 제약 조건 설정
//       const videoConstraints = {
//         width: { min: 640, ideal: 1280, max: 1920 },
//         height: { min: 480, ideal: 720, max: 1080 },
//         facingMode: "environment"
//       };

//       console.log("스캐너 시작 중...");
//       // 스캐너 시작 - 카메라 접근 권한 명시적으로 확인
//       navigator.mediaDevices
//         .getUserMedia({ video: videoConstraints })
//         .then((stream) => {
//           console.log("카메라 스트림 획득 성공:", stream);
          
//           // 비디오 요소에 직접 스트림 연결 테스트
//           try {
//             const testVideo = document.getElementById('qr-video-element') as HTMLVideoElement;
//             if (testVideo) {
//               testVideo.srcObject = stream;
//               testVideo.play()
//                 .then(() => console.log("비디오 재생 시작됨"))
//                 .catch(err => console.error("비디오 재생 오류:", err));
//             }
//           } catch (err) {
//             console.error("직접 비디오 재생 오류:", err);
//           }
          
//           // Html5QrCode를 사용한 스캐너 시작
//           html5QrCode
//             .start(
//               videoConstraints,
//               config,
//               (decodedText) => {
//                 console.log("QR 스캔 성공:", decodedText);
                
//                 // 카메라 스트림 중지 (명시적으로)
//                 stream.getTracks().forEach(track => track.stop());
                
//                 onScanSuccess(decodedText);
//               },
//               (errorMessage) => {
//                 console.log("QR 스캔 실패:", errorMessage);
//                 onScanFailure();
//               }
//             )
//             .then(() => {
//               console.log("스캐너가 성공적으로 시작됨");
              
//               // 비디오 요소 확인
//               setTimeout(() => {
//                 const videoElements = qrReaderRef.current?.querySelectorAll('video');
//                 console.log("현재 비디오 요소 수:", videoElements?.length);
//                 videoElements?.forEach((video, index) => {
//                   console.log(`비디오 ${index} 크기:`, video.videoWidth, "x", video.videoHeight);
//                   console.log(`비디오 ${index} 스타일:`, window.getComputedStyle(video));
//                   console.log(`비디오 ${index} 표시 상태:`, window.getComputedStyle(video).display);
//                 });
//               }, 1000);
              
//               window.qrScanner = html5QrCode;
//             })
//             .catch((err) => {
//               console.error("Scanner start error:", err);
//               console.error("Error details:", err.message, err.stack);
              
//               // 카메라 스트림 중지 (오류 발생 시)
//               stream.getTracks().forEach(track => track.stop());
              
//               clearError();
//               stopScanner();
//             });
//         })
//         .catch((err) => {
//           console.error("카메라 접근 오류:", err);
//           clearError();
//           stopScanner();
//         });
//     }
//   } catch (err) {
//     console.error("QR 스캐너 useEffect에서 예상치 못한 오류:", err);
//     clearError();
//     stopScanner();
//   }

//   // 컴포넌트 언마운트 시 정리
//   return () => {
//     console.log("QR 스캐너 cleanup 함수 실행");
//     if (window.qrScanner) {
//       console.log("스캐너 중지 시도");
//       window.qrScanner
//         .stop()
//         .then(() => {
//           console.log("스캐너가 성공적으로 중지됨");
//         })
//         .catch((err: Error): void => {
//           console.error("Scanner stop error:", err);
//         })
//         .finally((): void => {
//           window.qrScanner = null;
//           console.log("스캐너 인스턴스 제거됨");
//         });
//     }
    
//     // 추가: 모든 비디오 트랙 중지 시도
//     try {
//       const videoElements = document.querySelectorAll('video');
//       videoElements.forEach(video => {
//         if (video.srcObject) {
//           const stream = video.srcObject as MediaStream;
//           stream.getTracks().forEach(track => track.stop());
//         }
//       });
//     } catch (err) {
//       console.error("비디오 트랙 중지 오류:", err);
//     }
//   };
// }, [scanning, qrReaderRef, onScanSuccess, onScanFailure, clearError, stopScanner]);

//   return (
//     <div className="qr-scanner-container">
//       <ScannerHeader />

//       {!permissionGranted ? <PermissionRequest /> : <ScannerContent />}

//       {error && <ErrorMessage />}

//       {scanning && <ScanningGuide />}
//     </div>
//   )
// }

// export default QRScanner
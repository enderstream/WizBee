import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
    const navigate = useNavigate()

    // 일반적인 페이지 이동
    const toHome = () => navigate('/home')
    const toSettings = () => navigate('/settings')
    const toTimeLapse = () => navigate('/time-lapse')
    const toTimeLapseList = () => navigate('/time-lapse-list')
    const toSward = () => navigate('/blue-sward')
    const toQRScanner = () => navigate('/qr-scanner')
    const toRecord = () => navigate('/record')
    return {
        toHome,
        toSettings,
        toTimeLapse,
        toTimeLapseList,
        toSward,
        toQRScanner,
        toRecord
    }
}
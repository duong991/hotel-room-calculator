"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isAirConditioned, setIsAirConditioned] = useState(false);
    const [result, setResult] = useState<null | {
        totalMinutes: number;
        hours: number;
        minutes: number;
        firstHourPrice: number;
        nextHourPrice: number;
        remainingHours: number;
        total: number;
    }>(null);

    const getCurrentTimeString = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        setEndTime(getCurrentTimeString());
    }, []);

    const handleStartTimeChange = (value: string) => {
        const [startHour, startMin] = value.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        const start = startHour * 60 + startMin;
        const end = endHour * 60 + endMin;

        let newEndTime = endTime;
        if (start >= end) {
            const newEnd = start + 10;
            const hours = Math.floor(newEnd / 60) % 24;
            const minutes = newEnd % 60;
            newEndTime = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
            setEndTime(newEndTime);
        }

        setStartTime(value);
    };

    const resetEndTime = () => {
        setEndTime(getCurrentTimeString());
    };

    const calculatePrice = () => {
        if (!startTime || !endTime) return;

        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        let start = startHour * 60 + startMin;
        let end = endHour * 60 + endMin;

        if (end <= start) {
            alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
            return;
        }

        let duration = end - start;

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        const totalHoursForPricing = Math.ceil(duration / 60);
        const firstHourPrice = isAirConditioned ? 50000 : 40000;
        const nextHourPrice = isAirConditioned ? 15000 : 10000;
        const remainingHours = Math.max(0, totalHoursForPricing - 1);
        const total = firstHourPrice + remainingHours * nextHourPrice;

        setResult({
            totalMinutes: duration,
            hours,
            minutes,
            firstHourPrice,
            nextHourPrice,
            remainingHours,
            total,
        });
    };

    return (
        <main className="max-w-md mx-auto mt-10 p-4 bg-white rounded-xl shadow space-y-4 text-gray-900 text-[15px] leading-relaxed">
            <h1 className="text-xl sm:text-2xl font-bold text-center">
                Tính tiền phòng nghỉ (theo giờ)
            </h1>

            <div className="space-y-4 text-base">
                <label className="block">
                    Giờ bắt đầu nghỉ:
                    <div className="flex items-center space-x-2">
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                                handleStartTimeChange(e.target.value)
                            }
                            className="w-full mt-1 p-2 border rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => setStartTime("")}
                            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                        >
                            Xóa giờ
                        </button>
                    </div>
                </label>

                <label className="block">
                    Giờ kết thúc nghỉ:
                    <div className="flex items-center space-x-2">
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 border rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={resetEndTime}
                            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                        >
                            Lấy giờ hiện tại
                        </button>
                    </div>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isAirConditioned}
                        onChange={(e) => setIsAirConditioned(e.target.checked)}
                    />
                    <span>Phòng có điều hòa</span>
                </label>

                <button
                    onClick={calculatePrice}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Tính tiền
                </button>
            </div>

            {result && (
                <div className="pt-4 border-t space-y-2 text-base">
                    <p>
                        <strong>Tổng thời gian nghỉ:</strong>{" "}
                        {result.hours > 0 ? `${result.hours} giờ` : ""}{" "}
                        {result.minutes > 0 ? `${result.minutes} phút` : ""} (
                        {result.totalMinutes} phút)
                    </p>
                    <p>
                        <strong>Giờ đầu:</strong>{" "}
                        {result.firstHourPrice.toLocaleString()} VND
                    </p>
                    <p>
                        <strong>Giờ tiếp theo:</strong> {result.remainingHours}{" "}
                        giờ →{" "}
                        {(
                            result.remainingHours * result.nextHourPrice
                        ).toLocaleString()}{" "}
                        VND
                    </p>
                    <p className="font-bold text-lg">
                        Tổng: {result.total.toLocaleString()} VND
                    </p>
                </div>
            )}
        </main>
    );
}

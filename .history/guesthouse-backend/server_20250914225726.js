const checkAvailability = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/rooms/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomType: "Single",
        checkInDate: "2025-09-20",
        checkOutDate: "2025-09-22"
      }),
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error checking availability", err);
  }
};

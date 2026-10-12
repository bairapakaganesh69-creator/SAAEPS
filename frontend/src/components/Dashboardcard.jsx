function DashboardCard({ title, value, color }) {
  return (
    <div
      style={{
        backgroundColor: color,
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
        textAlign: "center",
        margin: "10px",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;
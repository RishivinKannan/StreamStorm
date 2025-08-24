
const EachFeature = ({ title, description, icon }) => (
    <div className="each-feature">
        {icon && <>{icon}</>}
        <h2 className="feature-title">{title}</h2>
        <p className="feature-description">{description}</p>
    </div>
);

export default EachFeature; 
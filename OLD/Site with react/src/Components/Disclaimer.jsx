import { TriangleAlert } from 'lucide-react';

const Disclaimer = () => (
    <section className="disclaimer" id="disclaimer">
        <TriangleAlert color="var(--white)" size={40}/>
        <h2 className="disclaimer-title">Designed for Abuse. Not for the Faint-Hearted.</h2>
        <span className="disclaimer-text-1">
            No terms respected. No ethics included. This tool was built for one purpose: to give you the power to Storm, Flood, Disrupt, and Annoy.
        </span>
        <span className="disclaimer-text-2">
            Use it if you dare.. We take no responsibility for the consequences of your actions.
        </span>
    </section>
);

export default Disclaimer;
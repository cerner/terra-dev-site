import React from "react";
import SiteDocTemplate from "../SiteDocTemplate";
import readme from "./TestReadme.md";

const Index = () => {
    return (<SiteDocTemplate readme={readme}/>);
}

export default Index

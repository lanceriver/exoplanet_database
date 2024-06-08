'use client'
import {useState, useEffect} from 'react'
import Link from 'next/link'


const exoplanetLambda = "https://x7i7rkktkj.execute-api.us-east-1.amazonaws.com/Prod/exoplanetsapi/"


export function PlanetName() {
    return (
        <section className="[&>*]:text-lg font-bold">
            <GetDetails />
            <div className="mt-8">
                <Link href='/home' className="ml-4 ">Back to home</Link>
            </div>
        </section>
    )
}

export function Headings() {
    return (
        <section className="grid grid-rows-3 grid-flow-col gap-4 [&>*]:text-md font-bold space-y-20">
            <h1>Distance</h1>
            <h1>Radius</h1>
            <h1>Orbital Period</h1>
            <h1>Mass</h1>
            <h1>Discovery Year</h1>
            <h1>Host System</h1>
        </section>
    )
}

// function PlanetDetails() {
//     class Planet {
//         constructor(distance, radius, orbital_period, mass, discovery_year, host_system) {
//             this.distance = distance;
//             this.radius = radius;
//             this.orbital_period = orbital_period;
//             this.mass = mass;
//             this.discovery_year = discovery_year;
//             this.host_system = host_system;
//         } 
//     }
//     return Planet;
// }

function GetDetails() {
    var planet_name = localStorage.getItem("planet_name");
    const originalState = [];
    const [details, setDetails] = useState(originalState);
    const [err, setErr] = useState(null);
    useEffect(() => {
        async function getPlanetDetails(planet_name) {
            try {
                const link = exoplanetLambda;
                const apiLink =  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,pl_orbper,pl_rade,pl_bmasse,sy_dist+from+pscomppars+where+pl_name=%27"+planet_name+"%27&format=json";
                console.log(apiLink);
                const response = await fetch(link, {
                    method:"POST",
                    body:apiLink
                });
                const responseJson = await response.json();
                const responseObj = JSON.parse(responseJson)
                console.log(responseObj);
                const planetDetails = {
                    planet_name: responseObj.map(a => a.pl_name),
                    distance: responseObj.map(a => a.sy_dist),
                    radius: responseObj.map(a => a.pl_rade),
                    orbital_period: responseObj.map(a => a.pl_orbper),
                    mass: responseObj.map(a => a.pl_bmasse),
                    discovery_year: responseObj.map(a => a.disc_year),
                    host_system: responseObj.map(a => a.hostname)
                };
                console.log("the current planet in useffect is " + localStorage.getItem("planet_name"))
                console.log(planetDetails);
                setDetails([
                    ...details, planetDetails
                ]);
                }
            catch (err) {
                setErr(err);
                console.log(err);
            }
        }
        if (planet_name) {
            getPlanetDetails(planet_name);
        }
    }, [planet_name]);
    return (
        <section>
        {details && (
            <section className="text-wrap">
                    {details.map((details, index) => 
                            <h1 className="pt-10 pb-20 pl-4 text-wrap text-3xl font-bold text-black" key={index}>{details.planet_name}</h1>  
                    )}
                <ul>
                    {details.map((details, index) => (
                        <li className="grid grid-rows-4 grid-flow-col gap-4 [&>*]:pl-4 text-md font-bold gap-y-1" key={index}>
                            <p className="text-wrap">Distance</p>
                            <h2 className="text-wrap">{details.distance}</h2>
                            <p className="text-wrap">Radius</p>
                            <h2 className="text-wrap">{details.radius}</h2>
                            <p className="text-wrap">Orbital Period</p>
                            <h2 className="text-wrap">{details.orbital_period}</h2>
                            <p className="text-wrap">Mass</p>
                            <h2 className="text-wrap">{details.mass}</h2>
                            <p className="text-wrap">Discovery Year</p>
                            <h2 className="text-wrap">{details.discovery_year}</h2>
                            <p className="text-wrap">Host System</p>
                            <h2 className="text-wrap">{details.host_system}</h2>
                        </li>
                    ))}
                </ul>
            </section>
        )}
        {err && <p>{err}</p>}
    </section>
    )
}
"use client"
import { useState, useEffect, useRef } from "react";
import Link from 'next/link'
import { ImageOptimizerCache } from "next/dist/server/image-optimizer";



const nav_buttons = ["Home", "About", "Most Popular", "Random"];

const exoplanetUrl = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars";

const queryLink = "https://x7i7rkktkj.execute-api.us-east-1.amazonaws.com/Prod/exoplanetsqueryapi/";
export function NavBar() {
    const NavButtons = nav_buttons.map(nav_button => 
        <NavButton key={nav_button} label={nav_button}/>
        );
    return (
        <div className="flex flex-wrap">{NavButtons}</div>
    )
};


function NavButton({ label }) {
    return (
        <h1 className="px-1 text-sm">{label}</h1>
    );
};


export function TitleBanner() {
    return (
        <div className="my-30 flex justify-center">
                <p className="text-5xl font-bold">EXOPLANET</p>
        </div>
    );
}

export function Form({id, placeholder, onKeyDown}) {
    return (
        <div className="grid grid-rows-1 my-10 color-grey justify-center">
        <div>
        <input
            id={id}
            type="text"
            name="searchQueryInput"
            placeholder={placeholder}
            defaultValue=""
            onKeyDown={onKeyDown}
        />
        <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
            <path
            fill="#666666"
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
        />
        </svg>
        </button>
        </div>
        </div>
    );
}

export function SearchBar() {
    const [allChecked, setAllChecked] = useState([]);
    const [searchParams, setSearchParams] = useState({
        "categories": allChecked,
        "table": "pscomppars",
        "flag": "sy_dist",
        "filters": "<=4",
        "order": "desc"
    })
    function handleChange(e) {
        if (e.target.checked) {
            setAllChecked([...allChecked, e.target.value]);
            setSearchParams({
                "categories": [...allChecked, e.target.value],
                "table": "pscomppars",
                "flag": "sy_dist",
                "filters": "<=4",
                "order": "desc"
            })
            console.log(searchParams);
        }
        else {
            setAllChecked(allChecked.filter((item) => item !== e.target.value));
            setSearchParams({
                "categories": allChecked.filter((item) => item !== e.target.value),
                "table": "pscomppars",
                "flag": "sy_dist",
                "filters": "<=4",
                "order": "desc"
            })
            console.log(searchParams);
        }
    }
    const filtersList = checkboxContent.map(item => {
        return (
            <div className="grid justify-center">
                <span>{item.name}</span> <CheckBox value={item.id} onChange={handleChange} />
            </div>
        )
    })
    return (
        <div>
            <ul>{filtersList}</ul>
            <HandleSearch params={searchParams}/>
        </div>
    )
}


function HandleSearch({params}) {
    const [input, setInput] = useState(0);
    const [submit, setSubmit] = useState(false);
    const originalState = [];
    const [details, setDetails] = useState(originalState)
    const [status, setStatus] = useState(false)
    const [searchParams, setSearchParams] = useState(originalState);
    useEffect(() => {
        if (submit == true) {
            console.log("submitted");
            getPlanets(searchParams);
        }
        async function getPlanets(searchParams) {
            try {
                const response = await fetch(queryLink, {
                    method: "POST",
                    body: JSON.stringify(searchParams)
                });
                const responseJson = await response.json();
                const responseArray = JSON.parse(responseJson);
                console.log(responseArray);
                const planetArray = []
                responseArray.forEach((item) => {
                    planetArray.push(item)
                });
                setDetails(planetArray);
                setStatus(true);
                
            }
            catch (err) {
                console.log(err);
            }
        }
    },[searchParams])
    function handleOnKeyDown(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            setInput(e.target.value);
            setSearchParams(params);
            console.log("i have pressed enter")
            console.log(params);
            setSubmit(true);
            console.log("submit is now" + submit)
        }
    }
    if (status == true) {
        localStorage.setItem("planet_name", input);
        console.log("the current planet is " + localStorage.getItem("planet_name"))
        return (
            <section>
                <Form id={"Search"} 
                placeholder={"Submit your search"}
                onKeyDown={(e)=>{handleOnKeyDown(e)}}
                />
                <Link href='/overview' className="flex justify-center">{input}</Link>
                <List data={details} categories={searchParams.categories} />
            </section>
        )
    }
    else {
        return (
            <section>
                <Form id={"Search"} 
                    placeholder={"Submit your search"}
                    onKeyDown={(e)=>{handleOnKeyDown(e)}}
                />
            </section>
            
        );
    }
}



function PlanetCard({planet_name, headers}) {
    const item = planet_name
    return (
        <div className="box-content grid grid-cols-3 ml-5 mr-10 my-5 bg-slate-200 border-">
            <div>
            {headers.map((header, index) => {
                var headerObj = checkboxContent.filter((category) => category.id == header);
                var heading = headerObj[0].name;
            if (header == "pl_name") {
                return (
                    <Link key={index} href='/overview' className="ml-5 text-3xl font-bold" onClick={() => {
                        localStorage.setItem("planet_name", item[header])
                    }}>{item[header]}</Link>
                )
            }
            if (item[header] == null) {
                return (
                    <div>
                        <p className="ml-5 text-lg font-bold">{heading}:</p>
                        <p className="ml-5 text-sm font-bold" key={index}>Not Available!</p>
                    </div>
                )
            }
            return (
                <div>
                    <p className="ml-5 text-lg font-bold">{heading}:</p>
                    <p className="ml-5 text-sm font-bold" key={index}>{item[header]}</p>
                </div>
            )
            })}
            </div>
        </div>
    )
};

function List({data, categories}) {
    var i = 0;
    data.forEach((item) => {
        item.id = i
        i++;
    })
    const headers = []
    for (let i = 0; i < categories.length; i++) {
        headers.push(categories[i])
    }
    const planetDataItems = data.map(item => {
                console.log(item);
                return (
                    <div>
                        <li className="grid grid-cols-3 ml-5 gap-y-7" key={item.id}>
                                <PlanetCard planet_name={item} headers={headers}/>
                        </li>
                    </div>
                );
    });
    localStorage.setItem("planet_table", planetDataItems);
    return (
        <div>
            <ul>{planetDataItems}</ul>
        </div>
    )
}

export function SearchFilters() {
}

function CheckBox({value, onChange}) {
    return (
        <div>
            <input type="checkbox" value={value} onChange={onChange}></input>
        </div>
    )
}

// function Table({arr, function}) {
//     return (
//         <section>
//             <ul>
//                 {arr.map((item => f))}
//             </ul>
//         </section>
//     )
// }

const checkboxContent = [
    {
        "name": "Planet Name", 
        "id": "pl_name"
    },
    {
        "name": "Distance (from Earth)",
        "id": "sy_dist"
    },
    {
        "name": "Mass (in Earths)",
        "id": "pl_bmasse"
    },
    {
        "name": "Orbital Period (days)",
        "id": "pl_orbper"
    },
    {
        "name": "Radius (in Earths)",
        "id": "pl_rade"
    },
    {
        "name": "Equilibrium Temperature (K)",
        "id": "pl_eqt"
    }
]
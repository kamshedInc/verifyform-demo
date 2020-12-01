import React, { useEffect, useState } from 'react'
import getVerified from '../../requests/getVerified'
import './Results.css'

export default function Results(props) {
    const { userInfo } = props
    let id,emailaddress;
    if (userInfo) {
        id = userInfo.id
        emailaddress = userInfo.emailaddress
    }
    const [ results, setResults ] = useState(null)

    useEffect(() => {
        (async () => {
            const verifiedInfo = await getVerified(id,emailaddress) || "No results could be loaded."
            console.log(verifiedInfo)
            setResults(verifiedInfo)
        })()
    }, [])

    const loaded = () => {
        if (results) {
            const fields = []
            let i = -1
            console.log(results)
            if (results !== "No results could be loaded.") {
                for (let r in results) {
                    fields.push(
                    <h3 
                        key={++i} 
                        className="results--info">
                        {`${r}: ${results[r]}`}
                    </h3>
                    )
                }
            } else {
                fields.push(
                    <h3 
                        key={++i} 
                        className="results--info">
                        { results }
                    </h3>
                    )
            }
            return (
                <>
                    <h1 className="results--header">Verified:</h1>
                    <div className="container wrapper__info info">{fields}</div>
                    <div className="wrapper__nextBtn">
                        <div className="container container__btn next btn">
                            <button id="nextBtn" onClick={() => window.close()}>Close</button>
                        </div>
                    </div>
                </>
            )
        }
    }

    const handleRender = () => {
        if (!results) {
            const loadingBlocks = []
            let num = Math.random()*10
            if (num < 4) num = 4
            else if (num > 8) num = 8
            else num = num
            for (let i=0;i<num;i++) {
                const rand = Math.random()
                let width = rand * 100
                if (width < 35) width = 50
                loadingBlocks.push(
                    <div
                        key={ i }
                        className="block--loading" 
                        style={{ 
                            marginLeft: '0px',
                            marginBottom: '5px',
                            width: `${width.toFixed(0)}%`,
                            height: '1.3rem'
                        }}>
                    </div>
                )
            }
            return (
                <>
                    <h5 className="results--loading">Loading verified...</h5>
                    <div className="wrapper__info info">{loadingBlocks}</div>
                </>
            )
        } else {
            return loaded()
        }
    }

    return (
        <div className="section section__results info grid">
            <div className="container container__results info grid">
                { handleRender() }
            </div>
        </div>
    )
}
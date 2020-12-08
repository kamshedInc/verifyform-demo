import React, { useState, useEffect } from 'react'
import './App.css'
import { LogProvider } from './LogContext'

import VerificationForm from './components/VerificationForm'
import ProgressBar from './components/ProgressBar/ProgressBar'
import LogCurrent from './components/ConsoleLogs/LogCurrent'
import Hint from './components/Hint/Hint'
import Loading from './Loading/Loading'
import Results from './components/Results/Results'
import HintBtn from '../src/components/Hint/HintBtn'
//require('dotenv').config()

function App() {
  const [ step, setStep ] = useState(1)
  const [ phone, setPhone ] = useState({
    phoneNumber: null, 
    verificationStatus: null, 
    isVerified: false
  })
  const [ hint, setHint ] = useState(true)
  const [ loading, setLoading ] = useState(false)
  const [ readyForResults, setReady ] = useState(false)
  let control = () => <></>
  
  useEffect(() => {
    setLoading(false)
    setHint(true)
    if (step === 4) setReady(true)
  }, [step])


  if (!hint) {
    if (readyForResults) {
      control = () => {
        return (
          <div className="app">
            <Results/>
          </div>
        )
      }
    } else {
      control = () => {
        return (
        <div className="app">
          { loading && <Loading/>}
          <ProgressBar step={ step }/>
          <LogProvider>
          <VerificationForm 
            step={ step } 
            phone={ phone }
            setStep={e => setStep(e) }
            setPhone={e => setPhone(e)}
            setLoading={ setLoading }
            />
            <HintBtn onClick={e => {
              e.preventDefault()
              setHint(true)
            }}/>
            <LogCurrent/>
          </LogProvider>
        </div>
      )}
    }
  } else {
    control = () => {
      return (
        <div className="app">
          <Hint step={ step } setHint={ setHint }/>
        </div>
      )
    }
  }
  

  return control()
}

export default App;

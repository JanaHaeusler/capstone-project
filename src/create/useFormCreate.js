import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import loadLocally from '../lib/loadLocally'
import saveLocally from '../lib/saveLocally'
import { 
    validateIsCorrectDate, 
    validateIsNotEmpty, 
    validateShotsIsInRange } from '../app/validators.services'

const STORAGE_KEY_1 = 'inputsKeyInfos'
const STORAGE_KEY_2 = 'inputsScores'

export default function useFormCreate({
    targetProfile,
    createGameProfile,
    addGameProfile }) {
    
    const history = useHistory()

    const [inputsKeyInfos, setInputsKeyInfos] = useState(loadLocally(STORAGE_KEY_1) ?? 
        {
            location: '',
            date: '',
            playersString: '',
            winner: '',
            shots: '',
    })
    const [inputsScores, setInputsScores] = useState(loadLocally(STORAGE_KEY_2) ?? {})
    
    const validInputs = {
        location: validateIsNotEmpty(inputsKeyInfos.location),
        date: validateIsCorrectDate(inputsKeyInfos.date),
        playersString: validateIsNotEmpty(inputsKeyInfos.playersString),
        winner: validateIsNotEmpty(inputsKeyInfos.winner),
        shots: validateShotsIsInRange(inputsKeyInfos.shots),
    }
    const isSaveButtonShown = Object.values(validInputs).every(isValid => isValid)
    
    const [isScoreCardShown, setIsScoreCardShown] = useState(false)
    
    const [dirtyInputs, setDirtyInputs] = useState({
        location: false,
        date: false,
        playersString: false,
        winner: false,
        shots: false,
    })

    useEffect(() => saveLocally(STORAGE_KEY_1, inputsKeyInfos), [inputsKeyInfos])
    useEffect(() => saveLocally(STORAGE_KEY_2, inputsScores), [inputsScores])
    useEffect(() => setInputsScores(targetProfile), [targetProfile])

    return {
        inputsKeyInfos, 
        inputsScores,
        isSaveButtonShown,
        isScoreCardShown,
        updateDirtyInputsKeyInfos,
        handleChangeKeyInfos,
        handleChangeScores,
        showErrorMessage,
        handleSubmitKeyInfos,
        handleSubmitScores,
        handleCancel,
    }

    function handleChangeKeyInfos(inputName, inputValue) {
        setInputsKeyInfos({
            ...inputsKeyInfos,
            [inputName]: inputValue
        })
    }

    function handleChangeScores(inputName, inputValue) {
        const inputNameSplitted = inputName.split('-')
        const holeName =  inputNameSplitted[0]
        const playerName = inputNameSplitted[1]
        setInputsScores({
            ...inputsScores,
            scores: {
                ...inputsScores.scores, 
                [playerName]: {
                    ...inputsScores.scores[playerName], 
                    [holeName]: inputValue
                }
            }
        })
    }

    function updateDirtyInputsKeyInfos(inputName) {
        setDirtyInputs({
            ...dirtyInputs,
            [inputName]: true
        })
    }

    function showErrorMessage(inputName) {
        const errorMessageLocation = `Please fill in location`
        const errorMessageDate = `Please choose a date`
        const errorMessagePlayersWinner = `Please fill in at least one ${inputName}`
        const errorMessageShots = `Please fill in a number between 18 and 126`

        if (inputName === 'location') {
            return dirtyInputs[inputName] && !validInputs[inputName] && errorMessageLocation
        }
        if (inputName === 'date') {
            return dirtyInputs[inputName] && !validInputs[inputName] && errorMessageDate
        }
        if (inputName === 'playersString' || inputName === 'winner' ) {
            return dirtyInputs[inputName] && !validInputs[inputName] && errorMessagePlayersWinner
        }
        if (inputName === 'shots') {
            return dirtyInputs[inputName] && !validInputs[inputName] && errorMessageShots
        }
    }

    function handleSubmitKeyInfos(event) {
        event.preventDefault()
        createGameProfile(inputsKeyInfos)
        resetFormKeyInfos()
        setIsScoreCardShown(true)
    }

    function handleSubmitScores(event) {
        event.preventDefault()
        addGameProfile(inputsScores) 
        resetFormScores()    
        setIsScoreCardShown(false)
        showOverviewPage()
    }

    function handleCancel() {
        resetFormKeyInfos()
        resetFormScores()
        showOverviewPage()
    }

    function resetFormKeyInfos() {
        setInputsKeyInfos({
            location: '',
            date: '',
            playersString: '',
            winner: '',
            shots:'',
        })
        setDirtyInputs({
            location: false,
            date: false,
            playersString: false,
            winner: false,
            shots: false,  
        })
    }

    function resetFormScores() {
        setInputsScores({})
    }

    function showOverviewPage() {
        history.push('/')
    }
}
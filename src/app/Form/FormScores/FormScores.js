import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'
import Button from '../../Button'
import { CancelIconDark, CheckIconLight } from '../../Icons/Icons'

FormScores.propTypes = {
  formInputs: PropTypes.object.isRequired,
  isSaveButtonShown: PropTypes.bool.isRequired,
  updateDirtyInputs: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  showErrorMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
}

export default function FormScores({
  formInputs,
  isSaveButtonShown,
  updateDirtyInputs,
  handleChange,
  showErrorMessage,
  handleSubmit,
  handleCancel,
}) {
  return (
    <Form onSubmit={handleSubmit} data-testid="form">
      <h3>Score</h3>
      <ScoreOverview>
        <Legend>
          <span>Holes</span>
          {new Array(18).fill().map((_, index) => {
            const newId = uuid()
            return <span key={newId}>{index + 1}</span>
          })}
        </Legend>
        <ScoresAllPlayers>
          {formInputs.playersArray?.map((player, index) => {
            const playerName = player
            const key = `singlePlayerInputs${index + 1}`
            return (
              <ScoreSinglePlayer key={key}>
                <span>{playerName}</span>
                {new Array(18).fill().map((_, index) => {
                  const inputNumber = index + 1
                  const holeName = 'hole' + inputNumber
                  const key = `singleScoreInput${inputNumber}`
                  return (
                    <SingleScore key={key}>
                      <input
                        type="number"
                        name={holeName + '-' + playerName}
                        id={holeName + '-' + playerName}
                        aria-label={'score ' + holeName + '-' + playerName}
                        value={formInputs.scores[playerName][holeName]}
                        onChange={(event) => {
                          handleChange(event.target.name, event.target.value)
                        }}
                        onBlur={(event) => updateDirtyInputs(event.target.name)}
                      />
                    </SingleScore>
                  )
                })}
              </ScoreSinglePlayer>
            )
          })}
        </ScoresAllPlayers>
      </ScoreOverview>
      <Note>{showErrorMessage()}</Note>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={handleCancel}
          iconComponent={<CancelIconDark />}
          text="Cancel"
          data-testid="button-cancel"
        />
        <Button
          main
          disabled={!isSaveButtonShown}
          iconComponent={<CheckIconLight />}
          text="Save"
          data-testid="button-save"
        />
      </ButtonWrapper>
    </Form>
  )
}

const Form = styled.form`
  margin: 10px 20px;
  padding: 10px;
  display: grid;
  place-items: center;
  border-radius: 25px;
  background-color: var(--light);
  font-family: 'Raleway', sans-serif;
  font-size: 1rem;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  Button {
    margin-top: 15px;
    margin-bottom: 5px;
  }
`
const ScoreOverview = styled.section`
  margin: 10px auto 20px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
  width: 90%;
`
const Legend = styled.div`
  padding-right: 20px;
  display: grid;
  grid-template-rows: repeat(19, 35px);
  align-items: center;
  border-right: 1px solid var(--secondary-light);

  span {
    width: 100%;
    text-align: center;
    font-weight: 550;
  }
`
const ScoresAllPlayers = styled.div`
  display: flex;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`
const ScoreSinglePlayer = styled.div`
  margin: 0 2px;
  padding-left: 1px;
  display: grid;
  grid-template-rows: repeat(19, 35px);
  align-items: center;
  min-width: 80px;

  span:first-child {
    font-weight: 550;
  }
`
const SingleScore = styled.label`
  input {
    padding: 5px;
    width: 100%;
    height: 100%;
    border-style: none;
    border-radius: 3px;
    background-color: var(--secondary-light);
    color: var(--secondary-medium);
    font-family: 'Raleway', sans-serif;
    font-size: 1rem;
  }
`
const Note = styled.span`
  margin-top: 5px;
  font-size: 0.7rem;
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  width: 100%;
`

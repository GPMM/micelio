import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BuildQuestion from '../../components/BuildQuestion';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function FinalForm () {

    const history = useHistory();
    const params = useParams();
    const location = useLocation();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [questionList, setQuestionList] = useState([]);
    const [answerList, setAnswerList] = useState([]);

    const [partId, setPartId] = useState();
    const [groupId, setGroupId] = useState();
    const [hasGameForm, setHasGameForm] = useState();

    useEffect(() => {
        setPartId(location.state.params.partId);
        setHasGameForm(location.state.params.hasGameForm);
    }, [location.state.params])

    useEffect(() => {
        getLists();
    }, [])

    const getLists = () => {
        Api.get(`/finalForm/${params.id}/${location.state.params.partId}`).then(response => {
            const questions = response.data.questions;
            const answers = response.data.answers;
            if (questions.length < 1) {
                setQuestionList(['']);
                setAnswerList(['']);
            } else {
                setQuestionList(questions);
                setAnswerList(answers);
            }
            setGroupId(response.data.groupId);
        });
    }

    const saveContent = async event => {
        event.preventDefault();

        let has_ended_exp = 'N';
        if (btnContinue) {
            has_ended_exp = 'S';
        }
        
        try {
            for (let i=0;i<answerList.length;i++) {
                const response = await Api.post(`/finalForm/${params.id}`, {
                    answer: answerList[i],
                    order: i,
                    participant_id: partId,
                    ended: has_ended_exp
                })

                if(!response.data.ok){
                    toast.error(`Não foi possível salvar os dados informados. Tente novamente`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }
        }catch (e) {
            toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }

        if (btnReturn) {
            if (groupId === "1") {
                history.push(`/specForm/${params.id}`, {params: partId});
            } else
            if (groupId === "3") {
                history.push(`/videoExp/${params.id}`, {params: {partId, groupId}});
            } else {
                if (hasGameForm === "S") {
                    history.push(`/gameForm/${params.id}`, {params: partId});
                } else {
                    history.push(`/gameExp/${params.id}`, {params: {partId, groupId}});
                }
            }
        }
        if (btnContinue) {
            history.push(`/thanks`);
        }
    }

    const changeAnswer = (value, index) => {   
        let newArrayAnswer = answerList;
        newArrayAnswer[index] = value;
        setAnswerList(newArrayAnswer);
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Questionário Final"/>
                <div className={'container'}>
                    <div>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    {questionList.map((question, index) => {
                                        return (
                                            <BuildQuestion key={index+questionList[index]}
                                                            index={index}
                                                            question={question}
                                                            text={answerList[index]}
                                                            onChangeFunction={changeAnswer}
                                            />
                                        );
                                    })}
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className={'b-return'}><button className={'primary'} onClick={() => {setBtnReturn(true)}}>Retornar</button></td>
                                                <td className={'b-continue'}><button className={'primary'} onClick={() => {setBtnContinue(true)}}>Concluir</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default FinalForm;
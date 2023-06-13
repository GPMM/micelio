import React from 'react';
import { useHistory } from 'react-router-dom';
import {AiOutlineForm, AiOutlineShareAlt, AiOutlineCrown, AiOutlineFolderAdd} from 'react-icons/ai'


const Hr = () => {
  return (
    <hr style={{
      color: '#dfdfdf',
      backgroundColor: '#dfdfdf',
      height: .5,
      borderColor: '#dfdfdf'
    }}/>
  );
}

function ExperimentCard(props) {

  const history = useHistory();

  return (
    <li id={props.id}>
      <div className={'card-header'} onClick={() => {history.push(`/expDetails/${props.id}`)}}>
        <h2>{props.name}</h2>
        {(props.isOwner === 1)
          ? (<AiOutlineCrown size={24} color={'#E9C46A'}/>)
          : (<AiOutlineCrown size={24} color={'#7c7c7c'}/>)}
      </div>
      <Hr/>
      <div className={'card-content'}>
        <p><b>Jogo vinculado: </b>{props.game}</p>
        {props.groups ? props.groups.length > 0 ? 
          <p><b>Grupo(s) de Sessão vinculado(s): </b><br/>{props.groups}</p>
          : '' : ''}
      </div>
      <div className={'card-options'}>
        <div className={'card-option'} onClick={props.addGroup}>
          <AiOutlineFolderAdd size={26}/>
        </div>
        <div className={'card-option'} onClick={() => {history.push(`/consentTerm/${props.id}`)}}>
          <AiOutlineForm size={25}/>
        </div>
        <div className={'card-option'} onClick={props.onShare}>
          <AiOutlineShareAlt size={25}/>
        </div>
      </div>
    </li>

  )
}

export default ExperimentCard;

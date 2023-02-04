import { useState } from 'react';
import Action from './Actions.js';
import ToolTipDecorator from './ToolTipDecorator.js';
import './Form.scss';

export default function Form({ children, onSubmit, onCancel }) {
  // Initialisation ------------------------------
  // Hooks ---------------------------------------
  // State ---------------------------------------
  // Context -------------------------------------
  // Handlers ------------------------------------
  // View ----------------------------------------
  return (  
    <div className="Form">

      <div className="FormTray">
        {
          children
        }
      </div>

      <Action.Tray>
        <ToolTipDecorator message="Submit record">
          <Action.Submit showText onClick={onSubmit} />
        </ToolTipDecorator>
        <ToolTipDecorator message="Cancel form">
          <Action.Cancel showText onClick={onCancel} />
        </ToolTipDecorator>
      </Action.Tray>

    </div>
  );
}

function Item({ children, label, htmlFor, advice, error }) {
  // Initialisation ------------------------------
  // Hooks ---------------------------------------
  // State ---------------------------------------
  // Context -------------------------------------
  // Handlers ------------------------------------
  // View ----------------------------------------
  return (
    <div className="FormItem">
      <label className="FormLabel" htmlFor={htmlFor}>{label}</label>
      {
        advice && <p className="FormAdvice">{advice}</p>
      }
      {
        children
      }
      {
        error && <p className="FormError">{error}</p>
      }
    </div>
  );
}

function useForm(initialRecord, conformance, { isValid, errorMessage }, onCancel, onSubmit) {
  // Initialisation ------------------------------
  // State ---------------------------------------
  const [record, setRecord] = useState(initialRecord);
  const [errors, setErrors] = useState(
    Object.keys(initialRecord).reduce((accum, key) => ({ ...accum, [key]: null }), {})
  );

  // Context -------------------------------------
  // Handlers ------------------------------------
  const handleChange = (event) => { 
    const { name, value } = event.target;
    const newValue = conformance.includes(name) ? parseInt(value) : value;
    setRecord({ ...record, [name]: newValue });
    setErrors({ ...errors, [name]: isValid[name](newValue) ? null : errorMessage[name]});
  };

  const isValidRecord = (record) => {
    let isRecordValid = true;
    Object.keys(isValid).forEach((key) => {
      if (isValid[key](record[key])) {
        errors[key] = null;
      } else {
        errors[key] = errorMessage[key];
        isRecordValid = false;
      }
    });
    return isRecordValid;
  }

  const handleSubmit = () => { 
    isValidRecord(record) && onSubmit(record) && onCancel();
    setErrors({...errors});
  };
  
  // View ----------------------------------------
  return [record, errors, handleChange, handleSubmit];
}

// -----------------------------------------
// Compose Form Object /////////////////////
// -----------------------------------------
Form.Item = Item;
Form.useForm = useForm;

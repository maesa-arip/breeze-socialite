import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextAreaInput(
    { type = 'text', rows = 3 ,  name, id, value, className, autoComplete, required, readOnly, isFocused, handleChange },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    const focusClassName = readOnly
        ? 'border-gray-200 focus:border-gray-200 focus:ring-gray-200'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <div className="flex flex-col items-start">
            <textarea
                type={type}
                name={name}
                rows={rows}
                id={id}
                value={value}
                className={`rounded-md shadow-sm ${focusClassName} ${className}`}
                // className={
                //     `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ` +
                //     className
                // }
                ref={input}
                autoComplete={autoComplete}
                required={required}
                readOnly={readOnly}
                onChange={(e) => handleChange(e)}
            />
        </div>
    );
});

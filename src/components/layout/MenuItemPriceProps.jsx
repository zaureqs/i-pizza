import Trash from "@/components/icons/Trash";
import ChevronUp from "../icons/ChevronUp";
import ChevronDown from "../icons/ChevronDown";
import { useState } from "react";

export default function MenuItemPriceProps({
  name,
  addLabel,
  props,
  setProps,
}) {
  const [isOpen, setIsOpen] = useState(false);



  function addProp() {
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0 }];
    });
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps((prevSizes) => {
      const newProps = [...prevSizes];
      newProps[index][prop] = newValue;
      return newProps;
    });
  }

  const removeProp = (index) => {
    setProps((prev) => prev.filter((v, i) => i !== index));
  };

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
    <button
    type="button"
    className="inline-flex p-1 border-0 justify-start w-full"
    onClick={() => setIsOpen(!isOpen)}
    >
    {isOpen ? (<ChevronUp />) : (<ChevronDown />)}
    <span>{name}</span>
    <span>{props?.length || 0}</span>
    </button>
      <div className= {isOpen ? 'block' : 'hidden'}>
        {props?.length > 0 &&
          props.map((size, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div>
                <label>name</label>
                <input
                  type="text"
                  placeholder="name"
                  value={size.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>
              <div>
                <label>Extra price</label>
                <input
                  type="text"
                  placeholder="price"
                  value={size.price}
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="bg-white mb-2 px-2"
                  onClick={() => removeProp(index)}
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        <button type="button" className="hover:bg-gray-300" onClick={addProp}>
          {addLabel}
        </button>
      </div>
    </div>
  );
}

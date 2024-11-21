import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import PropTypes from 'prop-types';


const ListMenu = ({children, list, setFunction, selected}) => {

  return (
    <Menu>
      <MenuButton className="rounded-md text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-slate-300 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
        <span className="">
          {children}
        </span>
      </MenuButton>
      <MenuItems 
        anchor="bottom end"
        transition
        className="w-1/3 bg-slate-200 rounded-xl z-50 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {list.map((item, i) => (
            <MenuItem key={`ListMenuItem${i}`}>
            <button 
                className={`
                ${item === selected ? 'bg-blue-500' : ''}
                group 
                flex w-full 
                items-center 
                gap-2 
                rounded-lg 
                py-1.5 
                px-3 
                data-[focus]:bg-blue-200
                `}
                onClick={() => setFunction(item)}
            >
                <p className="text-black" alt={item}>
                    {item}
                </p>
            </button>
            </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default ListMenu

ListMenu.propTypes = {
    children: PropTypes.object,
    list: PropTypes.array,
    selected: PropTypes.any,
    setFunction: PropTypes.func
}
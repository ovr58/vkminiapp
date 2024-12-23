import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import PropTypes from 'prop-types';


const ListMenu = ({children, listOfValues, listOfLabels, setFunction, selected}) => {
  console.log('ListMenu - ', listOfValues)
  return (
    <Menu>
      <MenuButton 
        className="rounded-md text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-slate-300 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
        onClick={selected === null ? setFunction : () => {}}
      >
        <span className="">
          {children}
        </span>
      </MenuButton>
      <MenuItems 
        anchor="bottom end"
        transition
        className="w-1/3 bg-slate-200 rounded-xl z-50 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {selected && listOfValues.map((item, i) => (
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
                <div className="text-black" alt={listOfLabels[i]}>
                    {listOfLabels[i].length > 0 ? listOfLabels[i].includes('Цвет') ? 
                    <div className='flex m-1 gap-3'>
                      <p>{`Цвет ${listOfLabels[i].split(' ')[1]} -`}</p>
                      <span className="w-6 h-6 rounded-full pr-4" style={{backgroundColor: listOfLabels[i].split(' ')[3]}}></span>
                    </div> : listOfLabels[i] : listOfLabels[i]}
                </div>
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
    listOfValues: PropTypes.array,
    listOfLabels: PropTypes.array,
    selected: PropTypes.any,
    setFunction: PropTypes.func
}
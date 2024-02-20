import { useState } from "react";
import { IoSettings } from "react-icons/io5";
import { RiStockFill } from "react-icons/ri";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  const addFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setIsOpen(false);
  };

  const handleSelectedFriend = (friend) => {
    setSelectedFriend((curselected) =>
      // Check if the currently selected friend's ID is the same as the clicked friend's ID
      // If they are the same, set the selected friend to null (deselect)
      // Otherwise, set the selected friend to the clicked friend
      curselected?.id === friend.id ? null : friend
    );
  };

  return (
    <div className="app">
      <Nav />
      <Greeting />
      <Hero onOpen={handleOpen} isOpen={isOpen} />
      {isOpen && <FormAddFriend onAddFriend={addFriend} />}

      <div className="friend_list">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectedFriend}
        />
        {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div>
      <div className="nav">
        <h2 className="logo">
          <span>
            <RiStockFill />
          </span>
          BudgetWise
        </h2>
        <div className="nav-links">
          <ul>
            <li>Transactions</li>
            <li>Planner</li>
            <li>
              <IoSettings />
            </li>
          </ul>
        </div>
      </div>
      <hr />
    </div>
  );
}
function Greeting() {
  return (
    <div className="greet">
      <h1>Good Morning</h1>
    </div>
  );
}
function Hero({ onOpen, isOpen }) {
  return (
    <div className="hero">
      <div className="intro">
        <h1>Today's Budget</h1>
        <p>You have spent $1500 this month.You're on track!</p>
        <div className="buttons">
          <button className="btn btn1" onClick={onOpen}>
            {isOpen ? "close" : "Add a friend"}
          </button>
          {/* <button className="btn btn2">Add a transaction</button> */}
        </div>
      </div>
    </div>
  );
}

const FriendList = ({ friends, onSelectFriend, selectedFriend }) => {
  // const friends = initialFriends;

  return (
    <ul className="friends">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, selectedFriend, onSelectFriend }) => {
  // Check if the friend is currently selected by comparing its id with the id of the selectedFriend.
  // Use optional chaining (?.) to safely access the id property of selectedFriend,
  // preventing errors if selectedFriend is null or undefined.
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className="friend">
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you {friend.balance}
        </p>
      ) : friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}

      <button className="button button1" onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
};

const FormAddFriend = ({ onAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <div className="parent-form">
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>Friend Name👫</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>🌅Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </div>
  );
};
const FormSplitBill = ({ selectedFriend }) => {
  return (
    <form className="form-split-bill">
      <h2>Split Bill With {selectedFriend?.name}</h2>
      <label>Bill value</label>
      <input type="text" placeholder="Enter bill value" />
      <label>Your expense</label>
      <input type="text" placeholder="Enter your expense" />
      <label>{selectedFriend?.name}'s expense</label>
      <input type="text" />
      <label>Who is paying the bill?</label>
      <select>
        <option value="you">You</option>
        <option value="friend">{selectedFriend?.name}</option>
      </select>
      <button type="submit">Split Bill</button>
    </form>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

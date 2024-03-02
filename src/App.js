import { useState } from "react";
import { IoSettings } from "react-icons/io5";
import { RiStockFill } from "react-icons/ri";

const initialFriends = [
  {
    id: 118836,
    name: "Koome",
    image: "./images-folder/koome.jpeg",
    balance: -7,
  },
  {
    id: 933372,
    name: "Esther",
    image: "./images-folder/esther.jpeg",
    balance: 20,
  },
  {
    id: 499476,
    name: "Dennis",
    image: "./images-folder/thor.jpeg",
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
    setIsOpen(false);
  };

  const handleSplitBill = (value) => {
    //console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
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
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
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
            {/* <li>Transactions</li> */}
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
  const hour = new Date().getHours();

  let greeting = "";

  if (hour >= 0 && hour < 12) {
    greeting = "Good Morning!";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  return (
    <div className="greet">
      <h1>{greeting}</h1>
    </div>
  );
}
function Hero({ onOpen, isOpen }) {
  return (
    <div className="hero">
      <div className="intro">
        <h1>Split Bills with Friends Effortlessly</h1>
        <p>
          Collaborate with friends to track shared expenses, simplify bill
          splitting, and keep your finances balanced together.
        </p>
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
      <img className="image" src={friend.image} alt={friend.name} />
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
          disabled
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </div>
  );
};
const FormSplitBill = ({ selectedFriend, onSplitBill }) => {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  //check first is there is a bill
  const paidByFriend = bill ? bill - userExpense : "";

  const [whoIsPaying, setWhoIsPaying] = useState("you");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !userExpense) return;
    onSplitBill(whoIsPaying === "you" ? paidByFriend : -userExpense);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Bill With {selectedFriend?.name}</h2>

      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        placeholder="Enter bill value"
      />

      <label>Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            //to make sure that what is paid by the user does not exceed the bill
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
        placeholder="Enter your expense"
      />

      <label>{selectedFriend?.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFriend?.name}</option>
      </select>
      <button type="submit">Split Bill</button>
    </form>
  );
};

//children prop
const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

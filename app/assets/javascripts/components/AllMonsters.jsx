// var React = require('react/addons');

function Monster(props) {
  const monster = props.monster;

  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <li className="list-group-item" id={monster.name} key={monster.name}>
      {monster.name}
      <button className="add_monster btn btn-primary badge" onClick={handleClick}>add</button>
    </li>
  );
};

function MonsterGroup(props) {
  const header = props.header;
  var monsters = props.monsters.map((monster) => {
    return <Monster monster = {monster} />
  });

  return (
      <div>
        <h3>{header}</h3>
        <ul className='list-group'>{monsters}</ul>
      </div>
  );
};

var AllMonsters = React.createClass({
  // mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      // General content.
      monsters: [],
      filteredMonsters: null,

      // Design Encounter.
      selectedMonsters: [],
      selectedPlayers: [],
      xpThreshold: {},
      adjustedXp: 0,

      option: 1,
    }
  },

  componentDidMount() {
    $.getJSON('5e-SRD-Monsters.json', (response) => {
      var filteredMonsters = this.sortByCR(response.monsters);
      this.setState({
        monsters: response.monsters,
        filteredMonsters: filteredMonsters
      });
    });

    this.renderSelect();
    this.renderPlayerBreakdown();
  },

  sortByCR: function(monsters) {
    var monsters_by_cr = {};
    monsters.map((monster) => {
      if (!monsters_by_cr[monster.challenge_rating])
        monsters_by_cr[monster.challenge_rating] = [];

      monsters_by_cr[monster.challenge_rating].push(monster);
    });
    return monsters_by_cr;
  },

  render: function() {
    if (this.state.filteredMonsters == null)
      return null;

    var chunkSize = 4;
    var filteredMonsters = this.state.filteredMonsters;
    var cats = Calculator.challengeRatings()
    .filter((cr) => {
      return filteredMonsters[cr] != null;
    })
    .map(function (key, index) {
      return (
        <div className="col-sm-3" key={"cr"+key}>
          <MonsterGroup monsters = {filteredMonsters[key]} header = {"CR: "+ key} />
        </div>
      );
    })
    .reduce((ar, elem, i) => {
      const ix = Math.floor(i/chunkSize);

      if(!ar[ix]) {
        ar[ix] = [];
      }
      ar[ix].push(elem);
      return ar;
    }, [])
    .map((chunk) => {
      return (<div className="row">{chunk}</div>);
    });

    return (<div>{cats}</div>);
  },

  addPlayer: function(player) {
    const players = this.state.selectedPlayers.push(player);
    const xpThreshold = Calculator.calculateXPThresholds(players);
    this.setState({
      selectedPlayers: players,
      xpThreshold: xpThreshold
    });

    const playersCount = (<div>123</div>);
    ReactDOM.render(
      playerCount,
      document.getElementById('number_of_players')
    );

    renderPlayerBreakdown();
  },

  addMonster: function(monster) {
    const monsters = this.state.selectedPlayers.push(monster);
    const adjustedXp = Calculator.calculateAdjustedXp(monsters)
    this.setState({
      selectedMonsters: monsters,
      adjustedXp: adjustedXp
    });
  },

  renderSelect: function() {
    const options = Calculator.difficulties().map((_, index) => {
      if (index == 0)
        return;

      return (<option value={index}>Level {index}</option>);
    });

    const container = (
      <div className="form-horizontal">
        <div className="form-group">
          <label className="col-sm-3 control-label">Add Player</label>
          <div className="col-sm-3" id="playerLevels">
            <select id="level" className="form-control" valueLink={this.linkState('option')}>
              {options}
            </select>
          </div>
          <div className="col-sm-3">
            <input type="button" id="add_player" value="Add" className="form-control" onClick={this.handleClick} />
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    );
    ReactDOM.render(
      container,
      document.getElementById('playerLevels')
    );
  },

  renderPlayerBreakdown: function() {
    const container = (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Easy</th>
            <th>Medium</th>
            <th>Hard</th>
            <th>Deadly</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.state.xpThreshold['Easy']}</td>
            <td>{this.state.xpThreshold['Medium']}</td>
            <td>{this.state.xpThreshold['Hard']}</td>
            <td>{this.state.xpThreshold['Deadly']}</td>
          </tr>
        </tbody>
      </table>
    );

    return container;
  },

  renderSelectedPlayers: function() {
    const list = this.state.selectedPlayers.map((player) => {
      <li id="player" className="presentation">
        <a >Level: {player}</a>
      </li>
    });
    const container = (
      <div>
        <ul>
          {list}
        </ul>
      </div>
    );
    return container;
  },

  handleClick: function() {
    var value = React.findDOMNode(this.refs.mySelect).value;
    console.log("======= handleClick: ", this.state.option);
  }
})

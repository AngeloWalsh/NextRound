class TeamList extends React.Component {
    state = {
      list: [],
      pageNumber: 1,
      totalPages: 1,
      search: {
        query: "",
        type: 0,
        isSearching: false,
        lastQuery: "",
        typeString: ""
      }
    };
  
    /*********** get all teams *******************/
    componentDidMount = () => {
      _logger("Mounting get all teams..");
      this.getAllTeams();
    };
  
    getAllTeams = () => {
      _logger("calling teams service getAllTeams");
      if (this.props.currentUser.roles[0] === "Coach") {
        teamServices
          .getTeamsByCurrentUser()
          .then(this.getTeamsByCurrentUserSuccess)
          .catch(this.onGetAllTeamsError);
      } else {
        teamServices
          .getAllTeams(this.state.pageNumber - 1, 9)
          .then(this.onGetAllTeamsSuccess)
          .catch(this.onGetAllTeamsError);
      }
    };
  
    getTeamsByCurrentUserSuccess = response => {
      _logger("Get all teams success, current user");
      let data = response.items || [];
      _logger("data: ", response);
      this.setState(() => {
        return {
          list: data.map(this.mapFields)
        };
      });
    };
  
    onGetAllTeamsSuccess = response => {
      _logger("Get all teams success");
      let data = response.item;
      this.setState(() => {
        return {
          list: data.pagedItems.map(this.mapFields),
          hasNext: data.hasNextPage,
          hasPrevious: data.hasPreviousPage,
          totalPages: data.totalPages
        };
      });
    };
  
    mapFields = item => {
      return (
        <Team
          team={item}
          teamInfo={this.getTeamInfo}
          active={this.activeStatus}
          edit={this.editTeam}
          key={item.id}
        />
      );
    };
  
    onGetAllTeamsError = error => {
      _logger("Error getting all teams TeamList", error);
      this.notify("No teams found");
    };
  
    pageController = e => {
      e.preventDefault();
      e.target.blur();
      const dest = parseInt(e.target.value);
      if (
        dest < 1 ||
        dest > this.state.totalPages ||
        dest === this.state.pageNumber
      ) {
        return;
      } else {
        const updater = () => {
          return { pageNumber: dest };
        };
        this.setState(updater, this.getAllTeams);
        window.scrollTo(0, 0);
      }
    };
  
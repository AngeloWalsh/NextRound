[ApiController]
public class TeamApiController : BaseApiController
{
    private ITeamService _teamService;
    private IAuthenticationService<int> _authService;

    public TeamApiController(ITeamService teamService, IAuthenticationService<int> authorizationService,
    ILogger<TeamApiController> logger) : base(logger)
    {
        _teamService = teamService;
        _authService = authorizationService;
    }

    [HttpPost]
    public ActionResult<ItemResponse<int>> Insert(TeamAddRequest model)
    {
        try
        {
            int userId = _authService.GetCurrentUserId();
            ItemResponse<int> resp = new ItemResponse<int>();
            resp.Item = _teamService.Insert(model, userId);
            return Created201(resp);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            return StatusCode(500, new ErrorResponse(ex.Message));
        }
    }

    [HttpGet("{id:int}")]
    public ActionResult<ItemResponse<Team>> GetById(int id)
    {
        try
        {
            Team model = _teamService.GetById(id);
            if (model == null)
            {
                return StatusCode(404, new ErrorResponse("Team not found"));
            }
            else
            {
                ItemResponse<Team> resp = new ItemResponse<Team>();
                resp.Item = model;
                return Ok200(resp);
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            return StatusCode(500, new ErrorResponse(ex.Message));
        }
    }

    [HttpGet("coach/{teamId:int}")]
    public ActionResult<ItemResponse<Team>> GetCoach(int teamId)
    {
        try
        {
            Coach model = _teamService.GetCoach(teamId);
            if (model == null)
            {
                return StatusCode(404, new ErrorResponse("Coach not found"));
            }
            else
            {
                ItemResponse<Coach> resp = new ItemResponse<Coach>();
                resp.Item = model;
                return Ok200(resp);
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());
            return StatusCode(500, new ErrorResponse(ex.Message));
        }
    }
}
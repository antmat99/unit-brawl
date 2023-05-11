function About() {
    return <>
        <h3>Unit Brawl</h3>

        <h4>Registering</h4>
        <div>When creating an account, please input <strong>your student ID</strong> (e.g. <code>s123456</code>) <strong>as your username</strong>.</div>

        <h4>Labs</h4>
        <div>In the Labs section you can see a list of the labs that have been created and registered so far. In each one you'll be able to see the requirements in the "Requirements" tab of the lab view.</div>

        <h5>Joining a lab</h5>
        <div>If there is an active lab, you can join it by clicking the "Join" button in the lab view. You will be asked to provide the <strong>link</strong> to the <strong>GitLab repository</strong> you have been provided for the laboratory. Upon doing so you will be added to the list of participants for the lab.</div>

        <h5>Checking your progress</h5>
        <div>After joining a laboratory, you will be able to check your progress from the "Progress" tab in the lab view. Simply press the "Check progress" and wait until you progress have been evaluated. <strong>Please do not refresh the page or navigate to a different section</strong> (e.g. Leaderboard or Profile) <strong>while the progress is being checked.</strong></div>
        <div>In order for your progress to be evaluated correctly by the application, please make sure to <strong>place your tests in the</strong> <code>tests/sXXXXXX</code> <strong>package of the project</strong>, where <code>sXXXXXX</code> is your student ID.</div>
        <div>When browsing your progress status, you will see a <strong>test report summary</strong> on the left. Here you can check your progress in each laboratory requirement. If one or more methods for a requirement present some issues, you will see them reported here.</div>
        <div> Once you have added your own tests (and they pass), a <strong>coverage report</strong> will be generated as well. In it you can see the coverage percentage of <strong>instructions</strong>, <strong>methods</strong> and <strong>classes</strong> obtained by your tests. Your goal is to provide high-quality tests, so try to get the highest coverage percentage possible!</div>
    </>
}

export default About
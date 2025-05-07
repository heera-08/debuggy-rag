// public/app.js - Frontend JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
    
    // Solve bug functionality
    const solveBtn = document.getElementById('solveBtn');
    const bugDescription = document.getElementById('bugDescription');
    const solutionContainer = document.getElementById('solution-container');
    const solutionOutput = document.getElementById('solution-output');
    const loadingIndicator = document.getElementById('loading');
    const copyBtn = document.getElementById('copyBtn');
    
    solveBtn.addEventListener('click', async () => {
        const bug = bugDescription.value.trim();
        
        if (!bug) {
            alert('Please describe your bug first');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        solutionContainer.classList.add('hidden');
        
        try {
            const response = await fetch('/api/solve-bug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bugDescription: bug })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                solutionOutput.textContent = data.solution;
                solutionContainer.classList.remove('hidden');
            } else {
                alert('Error: ' + (data.error || 'Failed to get solution'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server. Please try again.');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
    
    // Copy solution functionality
    copyBtn.addEventListener('click', () => {
        const solution = solutionOutput.textContent;
        navigator.clipboard.writeText(solution)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy solution. Please try again.');
            });
    });
    
    // Contribute functionality
    const contributeBtn = document.getElementById('contributeBtn');
    const contributeBug = document.getElementById('contributeBug');
    const contributeSolution = document.getElementById('contributeSolution');
    const contributeMessage = document.getElementById('contribute-message');
    
    contributeBtn.addEventListener('click', async () => {
        const bug = contributeBug.value.trim();
        const solution = contributeSolution.value.trim();
        
        if (!bug || !solution) {
            alert('Please fill in both bug description and solution');
            return;
        }
        
        try {
            const response = await fetch('/api/save-example', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bug, solution })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                contributeBug.value = '';
                contributeSolution.value = '';
                contributeMessage.classList.remove('hidden');
                setTimeout(() => {
                    contributeMessage.classList.add('hidden');
                }, 3000);
            } else {
                alert('Error: ' + (data.error || 'Failed to save your contribution'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server. Please try again.');
        }
    });
});
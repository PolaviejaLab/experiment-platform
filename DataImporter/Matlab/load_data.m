
% Experiment ID
experimentID = '';

% Server that contains the data
server = 'http://maira-server.champalimaud.pt:3000/';

%% Load and display list of participants

json = mwebread([server 'participant?experiment=' experimentID]);

% Determine participant names
for i = 1:numel(json)    
    json{i}.participant = '';
    participant = '';
    
    for j = 1:numel(json{i}.responses)
        if(iscell(json{i}.responses))
            if strcmp(json{i}.responses{j}.field, 'ParticipantID')
                participant = json{i}.responses{j}.value;
            end
        else
            if strcmp(json{i}.responses(j).field, 'ParticipantID')
                participant = json{i}.responses(j).value;
            end        
        end
    end
    
    if isfield(json{i}, 'x0x5F_id')
        json{i}.x_id = json{i}.x0x5F_id;
    end
    json{i}.participant = participant;
end


% Show list of participants
clc;
fprintf('\nParticipants for experiment %s\n\n', experimentID);
fprintf('ID                        \tName\n');
for i = 1:numel(json)
    fprintf('%s\t%s\n', json{i}.x_id, json{i}.participant);
end


%% Read data from server

% Participant identification code (copy from table)
participantID = '';

dataLink = [server 'participant/' participantID];
json = mwebread(dataLink);

% Parse responses
data = struct();

for i = 1:numel(json.responses)
    if iscell(json.responses)
        field = json.responses{i}.field;
        value = json.responses{i}.value;
    else
        field = json.responses(i).field;
        value = json.responses(i).value;
    end
    
    parts = strsplit(field, '.');
    
    for j = 1:numel(parts)
        if parts{j}(1) >= '0' && parts{j}(1) <= '9'
            parts{j} = ['Q' parts{j}];
        end
    end
    
    field = strjoin(parts, '.');
    
    statement = ['data.' field ' = value;'];
    eval(statement);
end


fprintf('\nData for participant %s had been loaded into ''data''\n\n', participantID);

disp(data);

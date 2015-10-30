function J = mwebread(url)
    S = urlread(url);    
    J = loadjson(S);
end
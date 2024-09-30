const ActionButtonDropDown = ({ defaultValue, changeHandler, deviceList, type }) => {
    let dropDownEl;

    if (type === "video") {
        dropDownEl = deviceList.map(vd => (
            <option key={vd.deviceId} value={vd.deviceId}>
                {vd.label || `Video Device ${vd.deviceId}`}
            </option>
        ));
    } else if (type === "audio") {
        const audioInputEl = [];
        const audioOutputEl = [];

        deviceList.forEach((d, i) => {
            if (d.kind === "audioinput") {
                audioInputEl.push(
                    <option key={`input${d.deviceId}`} value={`input${d.deviceId}`}>{d.label}</option>
                );
            } else if (d.kind === "audiooutput") {
                audioOutputEl.push(
                    <option key={`ouput${d.deviceId}`} value={`ouput${d.deviceId}`}>{d.label}</option>
                );
            }
        });

        // Ensure unique keys for optgroups
        audioInputEl.unshift(
            <optgroup key="audio-input-group" label="Input Devices" />
        );
        audioOutputEl.unshift(
            <optgroup key="audio-output-group" label="Output Devices" />
        );

        dropDownEl = audioInputEl.concat(audioOutputEl);
    }

    return (
        <div className="caret-dropdown" style={{ top: "-25px" }}>
            <select defaultValue={defaultValue} onChange={changeHandler}>
                {dropDownEl}
            </select>
        </div>
    );
};

export default ActionButtonDropDown;

# Loop through all files in the src/templates folder using while read
while read -r file; do
    # Get the file name without the path and extension
    file_name=$(basename "${file%.*}")
    echo "Creating file for $file_name language"

    # Create file who will be composed
    final_file="${GITHUB_WORKSPACE}/release-js/${file_name}-complete.js"

    # Check if release-js dir already exists
    if [ ! -d "${GITHUB_WORKSPACE}/release-js" ]; then
        mkdir "${GITHUB_WORKSPACE}/release-js"
    fi

    ( cat src/header.js; cat "${file}"; cat src/main.js ) > "${final_file}"

    # Replace '\' with '\\' in the file
    sed -i 's/\\/\\\\\\\\/g' "${final_file}"
    # Replace new lines with '\n'
    awk '{printf "%s\\\\n", $0}' "${final_file}" > out.js && mv out.js "${final_file}"
    # Replace '/' with '\/'
    sed -i 's/\//\\\//g' "${final_file}"
    # Replace '"' with '\"'
    sed -i 's/"/\\"/g' "${final_file}"

    # Check if release-scriptable dir already exists
    if [ ! -d "${GITHUB_WORKSPACE}/release-scriptable" ]; then
        mkdir "${GITHUB_WORKSPACE}/release-scriptable"
    fi

    # Create the .scriptable file
    echo "Creating .scriptable file for ${file_name}"
    echo -e \
"{
  \"always_run_in_app\" : false,
  \"icon\" : {
    \"color\" : \"red\",
    \"glyph\" : \"briefcase-medical\"
  },
  \"name\" : \"CovidGraph\",
  \"script\" : \"$(cat "${final_file}")\",
  \"share_sheet_inputs\" : [

  ]
}" > "${GITHUB_WORKSPACE}/release-scriptable/${file_name}.scriptable"

    echo "Created .scriptable file for ${file_name}"
done < <(find src/templates -name '*.js')